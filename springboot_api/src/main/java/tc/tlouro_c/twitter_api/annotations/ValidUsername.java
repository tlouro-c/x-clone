package tc.tlouro_c.twitter_api.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UsernameValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUsername {
    String message() default "Invalid username"; // Default error message
    Class<?>[] groups() default {}; // Group constraints
    Class<? extends Payload>[] payload() default {}; // For additional metadata
}