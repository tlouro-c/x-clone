package tc.tlouro_c.twitter_api.message;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.chatBox.ChatBox;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "message_sequence_generator")
    @SequenceGenerator(name = "message_sequence_generator", sequenceName = "message_sequence", allocationSize = 20)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "sender")
    private AppUser sender;

    @ManyToOne
    @JoinColumn(name = "receiver")
    private AppUser receiver;

    @ManyToOne
    private ChatBox chatBox;

    @Builder.Default
    private Instant timestamp = Instant.now();

    private String content;
}
