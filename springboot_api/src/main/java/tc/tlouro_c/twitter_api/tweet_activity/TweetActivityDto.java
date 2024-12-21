package tc.tlouro_c.twitter_api.tweet_activity;

import tc.tlouro_c.twitter_api.appUser.AppUserDto;
import tc.tlouro_c.twitter_api.tweet.TweetDto;

public record TweetActivityDto(
    Long id,
    TweetDto tweet,
    AppUserDto user,
    TweetActivityType type
) {
}
