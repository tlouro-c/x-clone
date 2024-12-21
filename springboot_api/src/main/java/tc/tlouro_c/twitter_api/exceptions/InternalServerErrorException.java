package tc.tlouro_c.twitter_api.exceptions;

public class InternalServerErrorException extends RuntimeException {
    public InternalServerErrorException(String message) {
        super(message);
    }
}
