package tc.tlouro_c.twitter_api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;

@Service @RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public CustomUserDetails loadById(String userId) throws UsernameNotFoundException {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public CustomUserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
