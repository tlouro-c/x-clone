package tc.tlouro_c.twitter_api.tweet;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.config.CustomUserDetails;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityDto;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityDtoMapper;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityRepository;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityService;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.util.List;

@Service @RequiredArgsConstructor
public class TweetService {

    private final TweetRepository tweetRepository;
    private final SecurityUtils securityUtils;
    private final AppUserRepository appUserRepository;
    private final TweetActivityService tweetActivityService;
    private final TweetActivityRepository tweetActivityRepository;
    private final TweetActivityDtoMapper tweetActivityDtoMapper;

    @Transactional
    public TweetActivityDto saveTweet(TweetForm tweetForm) {
        securityUtils.ensureResourceOwnership(tweetForm.getUserId());

        var user = appUserRepository.findById(tweetForm.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var tweet = Tweet.builder()
                .user(user)
                .content(tweetForm.getContent())
                .likesCount(0L)
                .retweetsCount(0L)
                .build();

        user.setPostsCount(user.getPostsCount() + 1);
        tweetRepository.save(tweet);
        return tweetActivityDtoMapper.apply(tweetActivityService.registerCreateActivity(tweet, user));
    }

    public void deleteTweet(Long tweetId) {
        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));
        securityUtils.ensureResourceOwnership(tweet.getUser().getId());
        tweetRepository.delete(tweet);
    }

    @Transactional
    public void retweetTweet(Long tweetId) {

        var authenticatedUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));
        var user = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        tweetActivityService.registerRetweetActivity(tweet, user);
    }

    @Transactional
    public void unretweetTweet(Long tweetId) {

        var authenticatedUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));
        var user = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        tweetActivityService.unregisterRetweetActivity(tweet, user);
    }

    @Transactional
    public void likeTweet(Long tweetId) {

        var authenticatedUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));
        var user = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        tweetActivityService.registerLikeActivity(tweet, user);

        appUserRepository.save(user);
    }

    @Transactional
    public void dislikeTweet(Long tweetId) {

        var authenticatedUser = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));
        var user = appUserRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        tweetActivityService.unregisterLikeActivity(tweet, user);

        appUserRepository.save(user);
    }

    public List<TweetActivityDto> searchTweets(String toMatch, int page) {

        page = Math.max(page, 1);
        var pageable = PageRequest.of(page - 1, 20);

        var searchResultsPage = tweetActivityRepository.findTweetsByContentOrUsername(toMatch, pageable);

        return searchResultsPage
                .stream()
                .map(tweetActivityDtoMapper)
                .toList();
    }
}
