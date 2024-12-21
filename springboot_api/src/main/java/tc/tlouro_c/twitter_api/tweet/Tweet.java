package tc.tlouro_c.twitter_api.tweet;

import jakarta.persistence.*;
import lombok.*;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivity;

import java.time.Instant;
import java.util.*;

@AllArgsConstructor @NoArgsConstructor @Builder @Getter @Setter
@Entity
@Table(name = "tweets")
public class Tweet {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tweet_sequence_generator")
    @SequenceGenerator(name = "tweet_sequence_generator", sequenceName = "tweet_sequence", allocationSize = 5)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser user;

    private String content;

    @Builder.Default
    private Long retweetsCount = 0L;

    @Builder.Default
    private Long likesCount = 0L;

    @OneToMany(mappedBy = "tweet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<TweetActivity> activity = new HashSet<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Long createdAtEpoch = Instant.now().getEpochSecond();

    // TODO ATTACHMENTS


    public void increaseLikesCount() {
        likesCount++;
    }

    public void decreaseLikesCount() {
        likesCount--;
    }

    public void increaseRetweetsCount() {
        retweetsCount++;
    }

    public void decreaseRetweetsCount() {
        retweetsCount--;
    }
}
