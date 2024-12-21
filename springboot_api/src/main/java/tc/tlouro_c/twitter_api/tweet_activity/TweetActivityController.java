package tc.tlouro_c.twitter_api.tweet_activity;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tc.tlouro_c.twitter_api.tweet.TweetDto;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
public class TweetActivityController {

    private final TweetActivityService tweetActivityService;

    @GetMapping
    public ResponseEntity<List<TweetActivityDto>> getTweetActivityFromUser(
            @RequestParam(name = "user") String userId,
            @RequestParam(name = "tweets", required = false) boolean includeTweets,
            @RequestParam(name = "retweets", required = false) boolean includeRetweets,
            @RequestParam(name = "likes", required = false) boolean includeLikes,
            @RequestParam(name = "page") int page) {

        var tweetActivityFromUserParams = new TweetActivityFromUserParams(userId, includeTweets, includeRetweets, includeLikes, page);

        return new ResponseEntity<>(tweetActivityService.getTweetActivityFromUser(tweetActivityFromUserParams),
                HttpStatus.OK);
    }


    @GetMapping("/following")
    public ResponseEntity<List<TweetActivityDto>> getTweetsFromFollowingUsers(
            @RequestParam(name = "user") String userId,
            @RequestParam(name = "page") int page) {
        return new ResponseEntity<>(tweetActivityService.getTweetsFromFollowingUsers(userId, page),
                HttpStatus.OK);
    }

    @GetMapping("/for-you")
    public ResponseEntity<List<TweetActivityDto>> getTweetsFromForYou(
            @RequestParam(name = "user") String userId,
            @RequestParam(name = "page") int page) {
        return new ResponseEntity<>(tweetActivityService.getTweetsFromForYou(userId, page),
                HttpStatus.OK);
    }
}
