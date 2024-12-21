package tc.tlouro_c.twitter_api.follow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class FollowForm {
    private String followedUserId;
    private String followerUserId;
}
