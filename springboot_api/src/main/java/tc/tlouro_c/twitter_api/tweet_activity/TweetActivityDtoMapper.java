package tc.tlouro_c.twitter_api.tweet_activity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;
import tc.tlouro_c.twitter_api.follow.Follow;
import tc.tlouro_c.twitter_api.follow.FollowDto;
import tc.tlouro_c.twitter_api.tweet.TweetDtoMapper;

import java.util.function.Function;

@Component @RequiredArgsConstructor
public class TweetActivityDtoMapper implements Function<TweetActivity, TweetActivityDto> {

    private final TweetDtoMapper tweetDtoMapper;
    private final AppUserDtoMapper appUserDtoMapper;

    @Override
    public TweetActivityDto apply(TweetActivity tweetActivity) {
        return new TweetActivityDto(
                tweetActivity.getId(),
                tweetDtoMapper.apply(tweetActivity.getTweet()),
                appUserDtoMapper.apply(tweetActivity.getUser()),
                tweetActivity.getType()
        );
    }
}
