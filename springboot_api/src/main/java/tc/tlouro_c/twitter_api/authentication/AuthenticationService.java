package tc.tlouro_c.twitter_api.authentication;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.appUser.UserRole;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;
import tc.tlouro_c.twitter_api.emailConfirmation.EmailConfirmationCode;
import tc.tlouro_c.twitter_api.emailConfirmation.EmailConfirmationCodeRepository;
import tc.tlouro_c.twitter_api.exceptions.BadAuthenticationException;
import tc.tlouro_c.twitter_api.exceptions.BadRefreshTokenException;
import tc.tlouro_c.twitter_api.exceptions.EmailConfirmationException;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.jwt.JwtService;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.time.Duration;
import java.time.Instant;

@Service @RequiredArgsConstructor
public class AuthenticationService {

    private final JavaMailSender emailSender;
    private final AppUserRepository appUserRepository;
    private final EmailConfirmationCodeRepository emailConfirmationCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SecurityUtils securityUtils;

    public AuthenticationResponse login(LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getLogin(),
                    loginRequest.getPassword()
            ));
        } catch (Exception e) {
            throw new BadAuthenticationException(e.getMessage());
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        var user = (CustomUserDetails) authentication.getPrincipal();

        setRefreshTokenCookie(response, user);
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .hasPendingEmailConfirmation(!user.isEnabled())
                .build();
    }

    @Transactional
    public AuthenticationResponse register(@Valid RegistrationRequest registrationRequest, HttpServletResponse response) {

        if (!registrationRequest.getPassword().equals(registrationRequest.getRepeatPassword())) {
            throw new BadAuthenticationException("The passwords don't match.");
        }
        if (appUserRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
            throw new BadAuthenticationException("The username is already in use.");
        }
        if (appUserRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
            throw new BadAuthenticationException("The e-mail is already in use.");
        }
        var user = AppUser.builder()
                .username(registrationRequest.getUsername())
                .email(registrationRequest.getEmail())
                .name(registrationRequest.getName())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .role(UserRole.ROLE_USER)
                .resendEmailConfirmationTimeout(Instant.now())
                .build();
        sendEmailConfirmation(user, true);

        setRefreshTokenCookie(response, user);
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .hasPendingEmailConfirmation(true)
                .build();
    }

    @Transactional
    public void sendEmailConfirmation(AppUser user, boolean fromRegister) {

        if (user.isEnabled()) {
            throw new EmailConfirmationException("You already confirmed your e-mail");
        }

        if (Instant.now().isBefore(user.getResendEmailConfirmationTimeout())) {
            long remainingTimeSeconds = user.getResendEmailConfirmationTimeout().getEpochSecond() - Instant.now().getEpochSecond();
            throw new EmailConfirmationException("You must wait " + remainingTimeSeconds + " seconds before you can send another confirmation request.");
        }

        if (!fromRegister) {
            user.setResendEmailConfirmationTimeout(Instant.now().plus(Duration.ofSeconds(60)));
        }

        var sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append((int) (Math.random() * 10));
        }
        EmailConfirmationCode confirmationCode = EmailConfirmationCode.builder()
                .code(sb.toString())
                .user(user)
                .build();
        user.setEmailConfirmationCode(confirmationCode);
        appUserRepository.save(user);

        try {
            MimeMessageHelper helper = new MimeMessageHelper(emailSender.createMimeMessage(), true);
            helper.setTo(user.getEmail());
            helper.setSubject("Twitter - Confirm your email");
            String emailContent = formatEmailMessage(user, confirmationCode.getCode());
            helper.setText(emailContent, true);
            emailSender.send(helper.getMimeMessage());
        } catch (MessagingException e) {
            throw new EmailConfirmationException("Problem with e-mail confirmation");
        }
    }

    @Transactional
    public AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        var refreshToken = getRefreshTokenFromCookie(request);
        if (refreshToken == null || jwtService.isTokenExpired(refreshToken)) {
            throw new BadRefreshTokenException("Invalid refresh token, null or expired");
        }

        var authenticatedUser = appUserRepository.findById(jwtService.extractSubject(refreshToken))
                .orElseThrow(() -> new BadRefreshTokenException("Invalid refresh token, user not found"));

        jwtService.revokeToken(refreshToken);
        setRefreshTokenCookie(response, authenticatedUser);
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(authenticatedUser))
                .hasPendingEmailConfirmation(!authenticatedUser.isEnabled())
                .build();
    }

    @Transactional
    public AuthenticationResponse confirmEmail(String confirmationCode) {
        var emailConfirmationCode = emailConfirmationCodeRepository.findByCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid confirmation code"));

        var user = emailConfirmationCode.getUser();

        securityUtils.ensureResourceOwnership(emailConfirmationCode.getUser().getId());
        if (emailConfirmationCode.getExpiresAt().isBefore(Instant.now())) {
            throw new BadAuthenticationException("Expired confirmation code");
        }

        user.setEnabled(true);
        user.setEmailConfirmationCode(null);
        appUserRepository.save(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .hasPendingEmailConfirmation(!user.isEnabled())
                .build();
    }

    public void setRefreshTokenCookie(HttpServletResponse response, CustomUserDetails userDetails) {
        var refreshTokenCookie = ResponseCookie.from("refresh_token", jwtService.generateRefreshToken(userDetails))
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(jwtService.getRefreshTokenExpiration() / 1000)
                .sameSite("None")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        var refreshTokenCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private String formatEmailMessage(AppUser user, String confirmationCode) {

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #121212; color: #E0E0E0; }" +
                "  .email-container { max-width: 600px; margin: 0 auto; background-color: #1E1E1E; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); padding: 20px; }" +
                "  .email-header { text-align: center; padding-bottom: 20px; }" +
                "  .email-header h1 { font-size: 28px; color: #FFFFFF; margin: 0; }" +
                "  .email-content { padding: 20px; text-align: left; line-height: 1.6; }" +
                "  .email-content h2 { color: #FFFFFF; font-size: 22px; margin-top: 0; }" +
                "  .email-content p { color: #E0E0E0; font-size: 16px; margin: 12px 0; }" +
                "  .email-footer { text-align: center; padding-top: 20px; font-size: 12px; color: #AAAAAA; border-top: 1px solid #333333; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "  <div class='email-container'>" +
                "    <div class='email-header'>" +
                "      <h1>Welcome to Twitter!</h1>" +
                "    </div>" +
                "    <div class='email-content'>" +
                "      <h2>Hi " + user.getUsername() + ",</h2>" +
                "      <p>Thank you for signing up for Twitter! Here is your confirmation code</p>" +
                "      <p>" + confirmationCode + "</p>" +
                "      <p>If you didn’t sign up for Twitter, please ignore this email. Your account won’t be created until you confirm your email address.</p>" +
                "    </div>" +
                "    <div class='email-footer'>" +
                "      <p>Best regards,</p>" +
                "      <p>The Twitter Team</p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {

        String accessToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        accessToken = accessToken.substring(7);
        jwtService.revokeToken(accessToken);

        String refreshToken = getRefreshTokenFromCookie(request);
        if (refreshToken != null) {
            try {
                jwtService.revokeToken(refreshToken);
            } catch (Exception e) {
                System.out.println("Refresh token already expired");
            }
            deleteRefreshTokenCookie(response);
        }
    }
}
