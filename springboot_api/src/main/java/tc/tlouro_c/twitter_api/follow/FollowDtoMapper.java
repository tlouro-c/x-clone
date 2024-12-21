package tc.tlouro_c.twitter_api.follow;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;

import java.util.function.Function;

@Component @RequiredArgsConstructor
public class FollowDtoMapper implements Function<Follow, FollowDto> {

    private final AppUserDtoMapper appUserDtoMapper;

    @Override
    public FollowDto apply(Follow follow) {
        return new FollowDto(
                follow.getId(),
                appUserDtoMapper.apply(follow.getFollowedUser()),
                appUserDtoMapper.apply(follow.getFollowerUser()),
                follow.getFollowingSince()
        );
    }
}
