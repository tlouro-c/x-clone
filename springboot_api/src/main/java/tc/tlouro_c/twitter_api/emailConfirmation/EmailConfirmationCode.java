package tc.tlouro_c.twitter_api.emailConfirmation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tc.tlouro_c.twitter_api.appUser.AppUser;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.TemporalAmount;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "email_confirmation_codes")
public class EmailConfirmationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_confirmation_code_sequence_generator")
    @SequenceGenerator(name = "email_confirmation_code_sequence_generator", sequenceName = "email_confirmation_code_sequence", allocationSize = 5)
    private Long id;

    private String code;

    @Builder.Default
    private Instant expiresAt = Instant.now().plus(Duration.ofMinutes(15));

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private AppUser user;
}
