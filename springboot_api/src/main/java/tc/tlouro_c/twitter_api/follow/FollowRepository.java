package tc.tlouro_c.twitter_api.follow;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Page<Follow> findByFollowerUserId(String followerUserId, Pageable pageable);
    Page<Follow> findByFollowedUserId(String followedUserId, Pageable pageable);
    Optional<Follow> findByFollowerUserIdAndFollowedUserId(String followerUserId, String followedUserId);
}
