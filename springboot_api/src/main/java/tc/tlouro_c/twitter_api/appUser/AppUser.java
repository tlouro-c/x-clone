package tc.tlouro_c.twitter_api.appUser;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;
import tc.tlouro_c.twitter_api.emailConfirmation.EmailConfirmationCode;
import tc.tlouro_c.twitter_api.follow.Follow;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivity;

import java.time.Instant;
import java.util.*;

@Entity
@Table(name="app_users")
@AllArgsConstructor @NoArgsConstructor @Builder @Getter @Setter
public class AppUser implements CustomUserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private EmailConfirmationCode emailConfirmationCode;

    private Instant resendEmailConfirmationTimeout;

    private boolean isEnabled;

    private String password;

    @Enumerated(value = EnumType.STRING)
    private UserRole role;

    private String avatar;

    @Builder.Default
    private Long postsCount = 0L;

    @Builder.Default
    private Long followersCount = 0L;

    @Builder.Default
    private Long followingCount = 0L;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<TweetActivity> tweetActivity = new HashSet<>();

    @OneToMany(mappedBy = "followedUser", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Follow> following = new HashSet<>();

    @OneToMany(mappedBy = "followerUser", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Follow> followers = new HashSet<>();

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
}
