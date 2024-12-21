package tc.tlouro_c.twitter_api.message;

import lombok.Data;

@Data
public class MessageRequest {
    private String senderId;
    private String receiverId;
    private String content;
}
