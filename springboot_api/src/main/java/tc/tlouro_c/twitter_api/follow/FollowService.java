package tc.tlouro_c.twitter_api.follow;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.appUser.AppUserDto;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.util.List;

@Service @RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final SecurityUtils securityUtils;
    private final AppUserRepository appUserRepository;
    private final FollowDtoMapper followDtoMapper;
    private final AppUserDtoMapper appUserDtoMapper;

    @Transactional
    public FollowDto saveFollow(FollowForm followForm) {
        securityUtils.ensureResourceOwnership(followForm.getFollowerUserId());

        var followedUser = appUserRepository.findById(followForm.getFollowedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var followerUser = appUserRepository.findById(followForm.getFollowerUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var follow = Follow.builder()
                .followedUser(followedUser)
                .followerUser(followerUser)
                .build();

        followedUser.setFollowersCount(followedUser.getFollowersCount() + 1);
        followerUser.setFollowingCount(followerUser.getFollowingCount() + 1);

        appUserRepository.save(followedUser);
        appUserRepository.save(followerUser);

        return followDtoMapper.apply(followRepository.save(follow));
    }

    public void deleteFollow(FollowForm followForm) {
        securityUtils.ensureResourceOwnership(followForm.getFollowerUserId());

        var follow = followRepository.findByFollowerUserIdAndFollowedUserId(
                followForm.getFollowerUserId(),
                followForm.getFollowedUserId()
        ).orElseThrow(() -> new ResourceNotFoundException("You don't follow this user"));

        var followedUser = follow.getFollowedUser();
        var followerUser = follow.getFollowerUser();

        followedUser.setFollowersCount(followedUser.getFollowersCount() - 1);
        followerUser.setFollowingCount(followedUser.getFollowingCount() - 1);

        followRepository.delete(follow);
    }

    public List<AppUserDto> getUserFollowers(String userId, int page) {
        page = Math.max(page, 1);
        Pageable pageable = PageRequest.of(page - 1, 20, Sort.by("followingSince").descending());

        return followRepository.findByFollowedUserId(userId, pageable)
                .stream()
                .map(follow -> appUserDtoMapper.apply(follow.getFollowerUser()))
                .toList();
    }

    public List<AppUserDto> getUserFollowings(String userId, int page) {
        page = Math.max(page, 1);
        Pageable pageable = PageRequest.of(page - 1, 20, Sort.by("followingSince").descending());

        return followRepository.findByFollowerUserId(userId, pageable)
                .stream()
                .map(follow -> appUserDtoMapper.apply(follow.getFollowedUser()))
                .toList();
    }
}
