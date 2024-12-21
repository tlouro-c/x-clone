package tc.tlouro_c.twitter_api.exceptions;

public class BadAuthenticationException extends RuntimeException {
    public BadAuthenticationException(String message) {
        super(message);
    }
}
