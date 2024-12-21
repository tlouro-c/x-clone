package tc.tlouro_c.twitter_api.utils;

import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;

@Component
public class SecurityUtils {

    public void ensureResourceOwnership(String claimedUserId) {

        var authenticatedUser = getAuthenticatedUserDetails();
        boolean isAdmin = false;
        for (GrantedAuthority authority : authenticatedUser.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) {
                isAdmin = true;
                break;
            }
        }
        if (claimedUserId.equals(authenticatedUser.getId()) || isAdmin) {
            return;
        }
        throw new AuthorizationDeniedException("You don't have access to this resource");
    }

    public void ensureOneOfTwoResourceOwnership(String claimedUserIdA, String claimedUserIdB) {

        var authenticatedUser = getAuthenticatedUserDetails();
        boolean isAdmin = false;
        for (GrantedAuthority authority : authenticatedUser.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) {
                isAdmin = true;
                break;
            }
        }
        if (claimedUserIdA.equals(authenticatedUser.getId()) || claimedUserIdB.equals(authenticatedUser.getId()) || isAdmin) {
            return;
        }
        throw new AuthorizationDeniedException("You don't have access to this resource");
    }

    public CustomUserDetails getAuthenticatedUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public void ensureIsAdmin() {
        var authenticatedUser = getAuthenticatedUserDetails();
        boolean isAdmin = false;
        for (GrantedAuthority authority : authenticatedUser.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_ADMIN")) {
                isAdmin = true;
                break;
            }
        }
        if (isAdmin) {
            return;
        }
        throw new AuthorizationDeniedException("You don't have access to this resource");
    }
}
