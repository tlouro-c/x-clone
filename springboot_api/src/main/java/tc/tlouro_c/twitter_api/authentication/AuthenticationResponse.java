package tc.tlouro_c.twitter_api.authentication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AuthenticationResponse {

    private String accessToken;

    private boolean hasPendingEmailConfirmation;
}
