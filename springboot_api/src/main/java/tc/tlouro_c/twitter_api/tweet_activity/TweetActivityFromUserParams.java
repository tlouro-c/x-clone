package tc.tlouro_c.twitter_api.tweet_activity;

public record TweetActivityFromUserParams(
        String userId,
        boolean includeTweets,
        boolean includeRetweets,
        boolean includeLikes,
        int page
)
{}
