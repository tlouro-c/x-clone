package tc.tlouro_c.twitter_api.appUser;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUserDeleteRequest {

    @NotNull
    private String id;

    @NotNull
    private String password;
}
