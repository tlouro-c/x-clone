package tc.tlouro_c.twitter_api.authentication;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.utils.BasicApiResponse;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final SecurityUtils securityUtils;
    private final AppUserRepository appUserRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegistrationRequest registrationRequest,
            HttpServletResponse response) {
        return new ResponseEntity<>(authenticationService.register(registrationRequest, response),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid LoginRequest loginRequest,
            HttpServletResponse response) {
        return new ResponseEntity<>(authenticationService.login(loginRequest, response),
                HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.logout(request, response);

        authenticationService.logout(request, response);
        return new ResponseEntity<>(new BasicApiResponse("Logged out successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam(name = "code") String confirmationCode) {

        return new ResponseEntity<>(authenticationService.confirmEmail(confirmationCode),
                HttpStatus.OK);
    }

    @GetMapping("/resend-email-confirmation")
    public ResponseEntity<?> resendEmailConfirmation() {
        var authenticatedUser = appUserRepository.findById(securityUtils.getAuthenticatedUserDetails().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        authenticationService.sendEmailConfirmation(authenticatedUser, false);

        return new ResponseEntity<>(new BasicApiResponse("Confirmation e-mail sent"),
                HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        return new ResponseEntity<>(authenticationService.refreshToken(request, response),
                HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<AuthenticationResponse> isAuthenticated() {
        var authenticatedUser = securityUtils.getAuthenticatedUserDetails();

        return new ResponseEntity<>(
                AuthenticationResponse.builder()
                        .hasPendingEmailConfirmation(!authenticatedUser.isEnabled())
                        .build()
                , HttpStatus.OK);
    }
}
