package tc.tlouro_c.twitter_api.config;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.appUser.UserRole;
import tc.tlouro_c.twitter_api.chatBox.ChatBox;
import tc.tlouro_c.twitter_api.chatBox.ChatBoxRepository;
import tc.tlouro_c.twitter_api.follow.Follow;
import tc.tlouro_c.twitter_api.follow.FollowForm;
import tc.tlouro_c.twitter_api.follow.FollowRepository;
import tc.tlouro_c.twitter_api.follow.FollowService;
import tc.tlouro_c.twitter_api.message.Message;
import tc.tlouro_c.twitter_api.message.MessageRepository;
import tc.tlouro_c.twitter_api.storage.StorageService;
import tc.tlouro_c.twitter_api.tweet.Tweet;
import tc.tlouro_c.twitter_api.tweet.TweetForm;
import tc.tlouro_c.twitter_api.tweet.TweetRepository;
import tc.tlouro_c.twitter_api.tweet.TweetService;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityService;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component @RequiredArgsConstructor
public class StartupRunner implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;
    private final FollowRepository followRepository;
    private final TweetService tweetService;
    private final TweetRepository tweetRepository;
    private final FollowService followService;

    @Override
    public void run(String... args) throws Exception {

        List<AppUser> users = List.of(
                AppUser.builder().username("user1").name("User One").email("user1@example.com").password(passwordEncoder.encode("password1")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user2").name("User Two").email("user2@example.com").password(passwordEncoder.encode("password2")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user3").name("User Three").email("user3@example.com").password(passwordEncoder.encode("password3")).role(UserRole.ROLE_ADMIN).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user4").name("User Four").email("user4@example.com").password(passwordEncoder.encode("password4")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user5").name("User Five").email("user5@example.com").password(passwordEncoder.encode("password5")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user6").name("User Six").email("user6@example.com").password(passwordEncoder.encode("password6")).role(UserRole.ROLE_ADMIN).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user7").name("User Seven").email("user7@example.com").password(passwordEncoder.encode("password7")).role(UserRole.ROLE_ADMIN).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user8").name("User Eight").email("user8@example.com").password(passwordEncoder.encode("password8")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user9").name("User Nine").email("user9@example.com").password(passwordEncoder.encode("password9")).role(UserRole.ROLE_ADMIN).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build(),
                AppUser.builder().username("user10").name("User Ten").email("user10@example.com").password(passwordEncoder.encode("password10")).role(UserRole.ROLE_USER).isEnabled(true).resendEmailConfirmationTimeout(Instant.now()).build()
        );

        for (AppUser user : users) {
            if (appUserRepository.findByUsername(user.getUsername()).isEmpty()) {
                userRepository.save(user);
            }
        }

        var savedUsers = appUserRepository.findAll();

        // Set admin for future actions
        AppUser admin = null;
        for (AppUser user : savedUsers) {
            if (user.getRole() == UserRole.ROLE_ADMIN) {
                admin = user;
                break;
            }
        }
        assert admin != null;
        var authentication = new UsernamePasswordAuthenticationToken(admin, null, admin.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate follows
        for (int i = 0; i < savedUsers.size(); i++) {
            for (int j = i + 1; j < savedUsers.size(); j++) {
                if (followRepository.findByFollowerUserIdAndFollowedUserId(savedUsers.get(i).getId(), savedUsers.get(j).getId()).isEmpty())
                    followService.saveFollow(FollowForm.builder().followedUserId(savedUsers.get(j).getId()).followerUserId(savedUsers.get(i).getId()).build());
            }
        }

    }
}
