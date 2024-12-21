package tc.tlouro_c.twitter_api.tweet;

import tc.tlouro_c.twitter_api.appUser.AppUserDto;

import java.time.Instant;

public record TweetDto (
        Long id,
        AppUserDto user,
        Instant createdAt,
        String content,
        Long likesCount,
        Long retweetsCount,
        Boolean isLikedByCurrentUser,
        Boolean isRetweetedByCurrentUser
) {}
