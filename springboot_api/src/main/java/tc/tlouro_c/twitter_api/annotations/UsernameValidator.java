package tc.tlouro_c.twitter_api.annotations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UsernameValidator implements ConstraintValidator<ValidUsername, String> {

    @Override
    public void initialize(ValidUsername constraintAnnotation) {
        // Initialization logic if needed
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (username == null) {
            return false;
        }

        if (username.matches("^[a-zA-Z0-9_]+$")) {
            return true;
        }

        String messageTemplate = "Username can only contain alphanumeric characters and underscores";
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(messageTemplate).addConstraintViolation();

        return false;
    }
}