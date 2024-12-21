package tc.tlouro_c.twitter_api.tweet_activity;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.exceptions.RepeatedOperationException;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.tweet.Tweet;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TweetActivityService {

    private final TweetActivityRepository tweetActivityRepository;
    private final TweetActivityDtoMapper tweetActivityDtoMapper;
    private final SecurityUtils securityUtils;

    public List<TweetActivityDto> getTweetActivityFromUser(TweetActivityFromUserParams tweetActivityFromUserParams) {

        var page = Math.max(tweetActivityFromUserParams.page(), 1);
        var pageable = PageRequest.of(page - 1, 20, Sort.by("date").descending());

        var activitiesPage = tweetActivityRepository.findByUserIdWithFilters(
                tweetActivityFromUserParams.userId(),
                tweetActivityFromUserParams.includeTweets(),
                tweetActivityFromUserParams.includeRetweets(),
                tweetActivityFromUserParams.includeLikes(),
                pageable
        );

        return activitiesPage.stream()
                .map(tweetActivityDtoMapper)
                .toList();
    }

    public List<TweetActivityDto> getTweetsFromFollowingUsers(String userId, int page) {
        securityUtils.ensureResourceOwnership(userId);

        page = Math.max(page, 1);
        Pageable pageable = PageRequest.of(page - 1, 20, Sort.by("date").descending());
        return tweetActivityRepository.findByFollowing(userId, pageable)
                .stream()
                .map(tweetActivityDtoMapper)
                .toList();
    }

    public List<TweetActivityDto> getTweetsFromForYou(String userId, int page) {
        securityUtils.ensureResourceOwnership(userId);

        page = Math.max(page, 1);
        Pageable pageable = PageRequest.of(page - 1, 20);
        return tweetActivityRepository.findForYouTweets(userId, pageable)
                .stream()
                .map(tweetActivityDtoMapper)
                .toList();
    }

    public void registerLikeActivity(Tweet tweet, AppUser user) {

        var isLiked = tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                user.getId(),
                TweetActivityType.LIKE
        ).isPresent();

        if (isLiked) {
            throw new RepeatedOperationException("Tweet already liked");
        }

        tweet.increaseLikesCount();
        tweetActivityRepository.save(TweetActivity.builder()
                .tweet(tweet)
                .user(user)
                .type(TweetActivityType.LIKE)
                .build()
        );
    }

    public void unregisterLikeActivity(Tweet tweet, AppUser user) {

        var like = tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                user.getId(),
                TweetActivityType.LIKE
        );

        if (like.isEmpty()) {
            throw new ResourceNotFoundException("Like not found");
        }

        tweet.decreaseLikesCount();
        tweetActivityRepository.delete(like.get());
    }

    public void registerRetweetActivity(Tweet tweet, AppUser user) {

        var isRetweeted = tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                user.getId(),
                TweetActivityType.RETWEET
        ).isPresent();

        if (isRetweeted) {
            throw new RepeatedOperationException("Tweet already retweeted");
        }

        tweet.increaseRetweetsCount();
        user.setPostsCount(user.getPostsCount() + 1);
        tweetActivityRepository.save(TweetActivity.builder()
                .tweet(tweet)
                .user(user)
                .type(TweetActivityType.RETWEET)
                .build()
        );
    }

    public void unregisterRetweetActivity(Tweet tweet, AppUser user) {

        var retweet = tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                user.getId(),
                TweetActivityType.RETWEET
        );

        if (retweet.isEmpty()) {
            throw new ResourceNotFoundException("Retweet not found");
        }

        tweet.decreaseRetweetsCount();
        user.setPostsCount(user.getPostsCount() - 1);
        tweetActivityRepository.delete(retweet.get());
    }

    public TweetActivity registerCreateActivity(Tweet tweet, AppUser user) {
        return tweetActivityRepository.save(TweetActivity.builder()
                .tweet(tweet)
                .user(user)
                .type(TweetActivityType.CREATE)
                .build()
        );
    }

}
