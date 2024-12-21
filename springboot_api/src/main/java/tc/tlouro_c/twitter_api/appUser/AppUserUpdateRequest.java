package tc.tlouro_c.twitter_api.appUser;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.Empty;
import tc.tlouro_c.twitter_api.annotations.ValidPassword;
import tc.tlouro_c.twitter_api.annotations.ValidUsername;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUserUpdateRequest {

    @NotNull
    private String id;

    @Nullable
    @ValidUsername
    @Size(min = 3, max = 15, message = "Username must be between 3 and 15 characters.")
    private String username;

    @Nullable
    @Size(max = 20, message = "Username must have a maximum of 20 characters.")
    private String name;

    @Nullable
    @Email(message = "Invalid e-mail address.")
    private String email;

    @Nullable
    @ValidPassword
    private String password;

    @Nullable
    private String repeatPassword;
}
