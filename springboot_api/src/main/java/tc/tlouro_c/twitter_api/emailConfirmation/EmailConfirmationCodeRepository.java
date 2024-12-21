package tc.tlouro_c.twitter_api.emailConfirmation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailConfirmationCodeRepository extends JpaRepository<EmailConfirmationCode, String> {
    Optional<EmailConfirmationCode> findByCode(String code);
}
