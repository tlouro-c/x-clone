package tc.tlouro_c.twitter_api.exceptions;

public class BadRefreshTokenException extends RuntimeException {
    public BadRefreshTokenException(String message) {
        super(message);
    }
}
