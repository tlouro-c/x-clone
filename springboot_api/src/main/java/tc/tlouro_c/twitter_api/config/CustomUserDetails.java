package tc.tlouro_c.twitter_api.config;

import org.springframework.security.core.userdetails.UserDetails;

public interface CustomUserDetails extends UserDetails {

    public String getId();
}
