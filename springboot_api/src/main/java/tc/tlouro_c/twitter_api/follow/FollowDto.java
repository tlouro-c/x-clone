package tc.tlouro_c.twitter_api.follow;

import tc.tlouro_c.twitter_api.appUser.AppUserDto;

import java.time.Instant;

public record FollowDto (
        Long id,
        AppUserDto followedUser,
        AppUserDto followerUser,
        Instant followingSince
) {}
