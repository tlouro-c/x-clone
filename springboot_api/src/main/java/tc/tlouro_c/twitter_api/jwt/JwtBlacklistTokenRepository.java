package tc.tlouro_c.twitter_api.jwt;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JwtBlacklistTokenRepository extends JpaRepository<JwtBlacklistedToken, String> {
}
