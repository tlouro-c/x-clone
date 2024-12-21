package tc.tlouro_c.twitter_api.tweet;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityRepository;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class TweetDtoMapper implements Function<Tweet, TweetDto> {

    private final AppUserDtoMapper appUserDtoMapper;
    private final TweetActivityRepository tweetActivityRepository;
    private final SecurityUtils securityUtils;

    private Boolean isLikedByCurrentUser(Tweet tweet) {

        var authenticatedUser = securityUtils.getAuthenticatedUserDetails();

        return tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                authenticatedUser.getId(),
                TweetActivityType.LIKE
        ).isPresent();
    }

    private Boolean isRetweetedByCurrentUser(Tweet tweet) {

        var authenticatedUser = securityUtils.getAuthenticatedUserDetails();

        return tweetActivityRepository.findByTweetIdAndUserIdAndType(
                tweet.getId(),
                authenticatedUser.getId(),
                TweetActivityType.RETWEET
        ).isPresent();
    }


    @Override
    public TweetDto apply(Tweet tweet) {
        return new TweetDto(
                tweet.getId(),
                appUserDtoMapper.apply(tweet.getUser()),
                tweet.getCreatedAt(),
                tweet.getContent(),
                tweet.getLikesCount(),
                tweet.getRetweetsCount(),
                isLikedByCurrentUser(tweet),
                isRetweetedByCurrentUser(tweet)
        );
    }
}
