package tc.tlouro_c.twitter_api.tweet_activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.tweet.Tweet;

import java.util.List;
import java.util.Optional;

@Repository
public interface TweetActivityRepository extends JpaRepository<TweetActivity, Long> {

    Optional<TweetActivity> findByTweetIdAndUserIdAndType(Long tweetId, String userId, TweetActivityType type);

    @Query("SELECT ta FROM TweetActivity ta WHERE ta.user.id = :userId" +
            " AND ((:includeTweets = true AND ta.type = tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.CREATE)" +
            " OR (:includeRetweets = true AND ta.type =  tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.RETWEET)" +
            " OR (:includeLikes = true AND ta.type =  tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.LIKE))")
    Page<TweetActivity> findByUserIdWithFilters(@Param("userId") String userId,
                                                @Param("includeTweets") Boolean includeTweets,
                                                @Param("includeRetweets") Boolean includeRetweets,
                                                @Param("includeLikes") Boolean includeLikes,
                                                Pageable pageable);

    @Query("SELECT t FROM TweetActivity t WHERE t.type IN (tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.CREATE , tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.RETWEET, tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.LIKE) AND t.user.id IN (" +
            "SELECT f.followedUser.id FROM Follow f WHERE f.followerUser.id = :userId)")
    Page<TweetActivity> findByFollowing(@Param("userId") String userId, Pageable pageable);


    @Query(
            value = """
    SELECT t
    FROM TweetActivity t
    ORDER BY (t.tweet.likesCount * 0.3)
           + (t.tweet.retweetsCount * 0.6)
           + (t.tweet.createdAtEpoch * 0.1)
           + (CASE
                WHEN t.user.id IN (
                    SELECT f.followedUser.id
                    FROM Follow f
                    WHERE f.followerUser.id = :userId
              ) THEN 1.5
              ELSE 0.0
              END) DESC
    """,
            countQuery = """
    SELECT COUNT(t)
    FROM TweetActivity t
    """
    )
    Page<TweetActivity> findForYouTweets(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT t FROM TweetActivity t WHERE t.type = tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType.CREATE AND (t.tweet.content ILIKE CONCAT('%', :toMatch, '%') OR t.user.username ILIKE CONCAT('%', :toMatch, '%'))")
    List<TweetActivity> findTweetsByContentOrUsername(@Param("toMatch") String toMatch, Pageable pageable);
}
