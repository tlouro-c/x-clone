package tc.tlouro_c.twitter_api.exceptions;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.*;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.sql.SQLException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;


@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleAccessDeniedException(AuthenticationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ProblemDetail handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(SQLException.class)
    public ProblemDetail handleSQLException(SQLException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage().substring(ex.getMessage().indexOf("Detail: ") + 8));
    }

    @ExceptionHandler(BadAuthenticationException.class)
    public ProblemDetail handleBadAuthenticationException(BadAuthenticationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(EmailConfirmationException.class)
    public ProblemDetail handleEmailConfirmationException(EmailConfirmationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(BadRefreshTokenException.class)
    public ProblemDetail handleBadRefreshTokenException(BadRefreshTokenException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(RepeatedOperationException.class)
    public ProblemDetail handleRepeatedOperationException(RepeatedOperationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public ProblemDetail handleInternalServerErrorException(InternalServerErrorException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            @NotNull HttpHeaders headers,
            @NotNull HttpStatusCode status,
            @NotNull WebRequest request) {

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                status,
                "One or more fields failed validation."
        );

        problemDetail.setTitle("Validation Error");
        problemDetail.setProperty("timestamp", Instant.now().toString());

        problemDetail.setDetail( ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> Objects.requireNonNull(fieldError.getDefaultMessage()))
                .collect(Collectors.joining()));

        return ResponseEntity.status(status).headers(headers).body(problemDetail);
    }
}