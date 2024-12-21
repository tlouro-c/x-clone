package tc.tlouro_c.twitter_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UsernameOrEmailAuthenticationProvider implements AuthenticationProvider {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String login = authentication.getName();
        String password = authentication.getCredentials().toString();

        CustomUserDetails user;
        try {
            user = userDetailsService.loadUserByUsername(login);
        } catch (UsernameNotFoundException e) {
            user = userDetailsService.loadUserByEmail(login);
        }

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid username, email, or password");
        }
        return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
