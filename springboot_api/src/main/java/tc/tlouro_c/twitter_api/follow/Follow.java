package tc.tlouro_c.twitter_api.follow;


import jakarta.persistence.*;
import lombok.*;
import tc.tlouro_c.twitter_api.appUser.AppUser;

import java.time.Instant;

@Builder @AllArgsConstructor @NoArgsConstructor @Getter @Setter
@Entity
@Table(
        name = "follows",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"followed_user_id", "follower_user_id"}
        )
)
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "follow_sequence_generator")
    @SequenceGenerator(name = "follow_sequence_generator", sequenceName = "follow_sequence", allocationSize = 5)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "followed_user_id", nullable = false)
    private AppUser followedUser;

    @ManyToOne
    @JoinColumn(name = "follower_user_id", nullable = false)
    private AppUser followerUser;

    @Builder.Default
    @Column(name = "following_since", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Instant followingSince = Instant.now();
}
