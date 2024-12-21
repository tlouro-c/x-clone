package tc.tlouro_c.twitter_api.tweet;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tc.tlouro_c.twitter_api.appUser.AppUserDto;
import tc.tlouro_c.twitter_api.tweet_activity.TweetActivityDto;
import tc.tlouro_c.twitter_api.utils.BasicApiResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tweets")
public class TweetController {

    private final TweetService tweetService;

    @PostMapping
    public ResponseEntity<TweetActivityDto> saveTweet(@RequestBody @Valid TweetForm tweetForm) {
        return new ResponseEntity<>(tweetService.saveTweet(tweetForm),
                HttpStatus.CREATED);
    }

    @DeleteMapping("/{tweetId}")
    public ResponseEntity<BasicApiResponse> deleteTweet(@PathVariable Long tweetId) {
        tweetService.deleteTweet(tweetId);
        return new ResponseEntity<>(new BasicApiResponse("Tweet deleted successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/{tweetId}/retweet")
    public ResponseEntity<BasicApiResponse> retweetTweet(@PathVariable Long tweetId) {
        tweetService.retweetTweet(tweetId);
        return new ResponseEntity<>(new BasicApiResponse("Tweet retweeted successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/{tweetId}/unretweet")
    public ResponseEntity<BasicApiResponse> unretweetTweet(@PathVariable Long tweetId) {
        tweetService.unretweetTweet(tweetId);
        return new ResponseEntity<>(new BasicApiResponse("Tweet unretweeted successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/{tweetId}/like")
    public ResponseEntity<BasicApiResponse> likeTweet(@PathVariable Long tweetId) {
        tweetService.likeTweet(tweetId);
        return new ResponseEntity<>(new BasicApiResponse("Tweet liked successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/{tweetId}/dislike")
    public ResponseEntity<BasicApiResponse> dislikeTweet(@PathVariable Long tweetId) {
        tweetService.dislikeTweet(tweetId);
        return new ResponseEntity<>(new BasicApiResponse("Tweet disliked successfully"),
                HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TweetActivityDto>> getTweetsSearch(
            @RequestParam(name = "toMatch") String toMatch,
            @RequestParam(name = "page") int page
    ) {
        return new ResponseEntity<>(tweetService.searchTweets(toMatch, page),
                HttpStatus.OK);
    }
}
