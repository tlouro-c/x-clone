package tc.tlouro_c.twitter_api.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
@Getter
@RequiredArgsConstructor
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${security.jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    private final JwtBlacklistTokenRepository jwtBlacklistTokenRepository;

    public String generateAccessToken(CustomUserDetails userDetails) {
        return generateToken(userDetails,
                Instant.now().plus(Duration.ofMillis(accessTokenExpiration)));
    }

    public String generateRefreshToken(CustomUserDetails userDetails) {
        return generateToken(userDetails,
                Instant.now().plus(Duration.ofMillis(refreshTokenExpiration)));
    }

    public String generateToken(CustomUserDetails userDetails, Instant expirationDate) {

        var extraClaims = new HashMap<String, String>();
        extraClaims.put("isEnabled", userDetails.isEnabled() ? "t" : "f");

        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getId())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expirationDate))
                .signWith(getSigningKey())
                .compact();
    }

    public void revokeToken(String token) {
        var expiredToken = JwtBlacklistedToken.builder()
                .token(token)
                .expiryDate(extractExpiration(token))
                .build();

        System.out.println("Revoking token " + token);
        jwtBlacklistTokenRepository.save(expiredToken);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Instant extractExpiration(String token) {
        Date expirationDate = extractClaim(token, Claims::getExpiration);
        return expirationDate.toInstant();
    }

    public boolean isTokenExpired(String token) {

        Instant expiration = extractExpiration(token);
        Instant now = Instant.now();

        boolean isExpired = expiration.isBefore(now);

        boolean isBlacklisted = jwtBlacklistTokenRepository.findById(token).isPresent();

        return isExpired || isBlacklisted;
    }

    public boolean isTokenValid(String token, CustomUserDetails userDetails) {
        return extractSubject(token).equals(userDetails.getId())
                && !isTokenExpired(token);
    }

    public SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs every hour, adjust as needed
    public void cleanExpiredTokens() {
        jwtBlacklistTokenRepository.findAll().stream()
                .filter(token -> token.getExpiryDate().isBefore(Instant.now()))
                .forEach(jwtBlacklistTokenRepository::delete);
    }
}
