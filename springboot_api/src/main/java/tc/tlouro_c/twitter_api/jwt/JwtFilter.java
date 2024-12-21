package tc.tlouro_c.twitter_api.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;
import tc.tlouro_c.twitter_api.config.CustomUserDetailsService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException, AuthenticationException {

        var authorizationHeader = request.getHeader("Authorization");
        if (SecurityContextHolder.getContext().getAuthentication() != null
                || authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token;
        String userId;
        CustomUserDetails userDetails;
        try {
            token = authorizationHeader.substring(7);
            userId = jwtService.extractSubject(token);
            userDetails = userDetailsService.loadById(userId);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        if (jwtService.isTokenValid(token, userDetails)) {
            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        if (!userDetails.isEnabled() &&
                !request.getRequestURI().equals("/api/v1/auth") &&
                !request.getRequestURI().equals("/api/v1/auth/logout") &&
                !request.getRequestURI().equals("/api/v1/auth/confirm-email") &&
                !request.getRequestURI().equals("/api/v1/auth/resend-email-confirmation") ) {
            SecurityContextHolder.getContext().setAuthentication(null);
        }
        filterChain.doFilter(request, response);
    }
}
