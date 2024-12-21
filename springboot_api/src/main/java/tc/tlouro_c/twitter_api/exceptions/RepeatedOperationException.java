package tc.tlouro_c.twitter_api.exceptions;

public class RepeatedOperationException extends RuntimeException {
    public RepeatedOperationException(String message) {
        super(message);
    }
}
