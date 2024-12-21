package tc.tlouro_c.twitter_api.appUser;

import java.time.Instant;

public record AppUserDto (
    String id,
    String avatar,
    String username,
    String name,
    String email,
    String role,
    Long postsCount,
    Long followersCount,
    Long followingCount,
    Boolean isFollowedByCurrentUser,
    Instant createdAt
) {}
