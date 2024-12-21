package tc.tlouro_c.twitter_api.appUser;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, String> {

    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByEmail(String email);

    @Query("SELECT u FROM AppUser u WHERE (u.username ILIKE CONCAT('%', :toMatch, '%') OR u.name ILIKE CONCAT('%', :toMatch, '%'))")
    List<AppUser> findByNameOrUsername(@Param("toMatch") String toMatch, Pageable pageable);
}
