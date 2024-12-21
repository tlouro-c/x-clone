package tc.tlouro_c.twitter_api.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tc.tlouro_c.twitter_api.annotations.ValidPassword;
import tc.tlouro_c.twitter_api.annotations.ValidUsername;

@Data @AllArgsConstructor @NoArgsConstructor
public class RegistrationRequest {

    @ValidUsername
    @Size(min = 3, max = 15, message = "Username must be between 3 and 15 characters.")
    private String username;

    @Size(max = 20, message = "Username must have a maximum of 20 characters.")
    private String name;

    @Email(message = "Invalid e-mail address.")
    private String email;

    @NotNull(message = "Password can't be empty.")
    @ValidPassword
    private String password;

    @NotNull(message = "Repeat Password can't be empty.")
    private String repeatPassword;
}
