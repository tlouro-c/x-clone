package tc.tlouro_c.twitter_api.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tc.tlouro_c.twitter_api.chatBox.ChatBox;

import java.time.Instant;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.chatBox.id = :chatBoxId AND m.timestamp > :timestamp")
    List<Message> findAllByChatBoxIdAndTimestampBeforeThirtySeconds(
            @Param("chatBoxId") Long chatBoxId,
            @Param("timestamp") Instant timestamp);

    Page<Message> findAllByChatBoxId(Long chatBoxId, Pageable pageable);

}
