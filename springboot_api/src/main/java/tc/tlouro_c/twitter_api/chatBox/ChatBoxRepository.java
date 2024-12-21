package tc.tlouro_c.twitter_api.chatBox;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tc.tlouro_c.twitter_api.message.Message;

import java.util.Optional;

@Repository
public interface ChatBoxRepository extends JpaRepository<ChatBox, Long> {

    @Query("SELECT c FROM ChatBox c WHERE " +
            "(c.userA.id = :userAId AND c.userB.id = :userBId) OR " +
            "(c.userA.id = :userBId AND c.userB.id = :userAId)")
    Optional<ChatBox> findByUsers(@Param("userAId") String userAId, @Param("userBId") String userBId);

    @Query("SELECT c FROM ChatBox c WHERE " +
            "c.userA.id = :userId OR c.userB.id = :userId " +
            "ORDER BY CASE WHEN c.lastMessage IS NULL THEN c.createdAt ELSE c.lastMessage.timestamp END DESC"
    )
    Page<ChatBox> findAllByUserId(@Param("userId") String userId, Pageable pageable);
}
