package tc.tlouro_c.twitter_api.jwt;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "jwt_blacklisted_tokens")
public class JwtBlacklistedToken {

    @Id
    private String token;
    private Instant expiryDate;
}
