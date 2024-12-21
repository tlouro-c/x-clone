package tc.tlouro_c.twitter_api.appUser;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;
import tc.tlouro_c.twitter_api.follow.FollowRepository;
import tc.tlouro_c.twitter_api.tweet.Tweet;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityType;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class AppUserDtoMapper implements Function<AppUser, AppUserDto> {

    private final SecurityUtils securityUtils;
    private final FollowRepository followRepository;

    private Boolean isFollowedByCurrentUser(AppUser user) {

        var authenticatedUser = securityUtils.getAuthenticatedUserDetails();

        return followRepository.findByFollowerUserIdAndFollowedUserId(
                authenticatedUser.getId(),
                user.getId()
        ).isPresent();
    }

    @Override
    public AppUserDto apply(AppUser appUser) {

        var authenticatedUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (appUser.getId().equals(authenticatedUser.getId())) {
            return new AppUserDto(
                    appUser.getId(),
                    appUser.getAvatar(),
                    appUser.getUsername(),
                    appUser.getName(),
                    appUser.getEmail(),
                    appUser.getRole().name(),
                    appUser.getPostsCount(),
                    appUser.getFollowersCount(),
                    appUser.getFollowingCount(),
                    isFollowedByCurrentUser(appUser),
                    appUser.getCreatedAt()
            );
        } else {
            return new AppUserDto(
                    appUser.getId(),
                    appUser.getAvatar(),
                    appUser.getUsername(),
                    appUser.getName(),
                    null,
                    appUser.getRole().name(),
                    appUser.getPostsCount(),
                    appUser.getFollowersCount(),
                    appUser.getFollowingCount(),
                    isFollowedByCurrentUser(appUser),
                    appUser.getCreatedAt()
            );
        }
    }
}
