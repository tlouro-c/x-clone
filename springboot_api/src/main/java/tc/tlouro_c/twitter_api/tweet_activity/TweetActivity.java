package tc.tlouro_c.twitter_api.tweet_activity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.tweet.Tweet;

import java.time.Instant;

@Entity
@Table(name = "tweet_activity")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TweetActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tweet_activity_sequence_generator")
    @SequenceGenerator(name = "tweet_activity_sequence_generator", sequenceName = "tweet_activity_sequence", allocationSize = 5)
    @JsonIgnore
    private Long id;

    @ManyToOne
    private Tweet tweet;

    @ManyToOne
    private AppUser user;

    @Enumerated(value = EnumType.STRING)
    private TweetActivityType type;

    @Builder.Default
    private Instant date = Instant.now();
}
