package tc.tlouro_c.twitter_api.tweet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TweetRepository extends JpaRepository<Tweet, Long> {

    Page<Tweet> findByUserId(String userId, Pageable pageable);

}
