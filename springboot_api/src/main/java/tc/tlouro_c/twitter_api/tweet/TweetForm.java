package tc.tlouro_c.twitter_api.tweet;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TweetForm {

    private String userId;

    @Size(max = 280)
    private String content;
}
