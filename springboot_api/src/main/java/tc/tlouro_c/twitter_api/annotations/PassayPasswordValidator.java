package tc.tlouro_c.twitter_api.annotations;

import org.passay.*;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class PassayPasswordValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
        // Initialization logic if needed
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return true; // Null password is invalid
        }

        PasswordValidator validator = new PasswordValidator(Arrays.asList(
                // At least 8 characters
                new LengthRule(8, 128),
                // At least one uppercase character
                new CharacterRule(EnglishCharacterData.UpperCase, 1),
                // At least one lowercase character
                new CharacterRule(EnglishCharacterData.LowerCase, 1),
                // At least one digit
                new CharacterRule(EnglishCharacterData.Digit, 1),
                // At least one special character
                new CharacterRule(EnglishCharacterData.Special, 1),
                // No whitespace allowed
                new WhitespaceRule()
        ));

        RuleResult result = validator.validate(new PasswordData(password));

        if (result.isValid()) {
            return true;
        }

        List<String> messages = validator.getMessages(result);
        String messageTemplate = String.join(", ", messages);
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(messageTemplate).addConstraintViolation();

        return false;
    }
}