package tc.tlouro_c.twitter_api.utils;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class BasicApiResponse {
    private String message;
}
