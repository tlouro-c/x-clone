package tc.tlouro_c.twitter_api.chatBox;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.message.Message;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "chat_boxes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_a", "user_b"})
)
public class ChatBox {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_box_sequence_generator")
    @SequenceGenerator(name = "chat_box_sequence_generator", sequenceName = "chat_box_sequence", allocationSize = 5)
    private Long id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "user_a")
    private AppUser userA;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "user_b")
    private AppUser userB;

    @OneToOne
    @Nullable
    private Message lastMessage;

    @OneToMany(mappedBy = "chatBox", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Message> history = new ArrayList<>();

    @Builder.Default
    private Instant createdAt = Instant.now();
}
