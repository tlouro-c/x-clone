package tc.tlouro_c.twitter_api.chatBox;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import tc.tlouro_c.twitter_api.appUser.AppUser;
import tc.tlouro_c.twitter_api.appUser.AppUserRepository;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.message.*;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatBoxService {

    private final ChatBoxRepository chatBoxRepository;
    private final SecurityUtils securityUtils;
    private final AppUserRepository appUserRepository;
    private final ChatBoxDtoMapper chatBoxDtoMapper;
    private final MessageRepository messageRepository;
    private final MessageDtoMapper messageDtoMapper;

    @Transactional
    public MessageDto saveMessage(MessageRequest messageRequest) {
        securityUtils.ensureResourceOwnership(messageRequest.getSenderId());

        var sender = appUserRepository.findById(messageRequest.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var receiver = appUserRepository.findById(messageRequest.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var chatBox = chatBoxRepository.findByUsers(sender.getId(), receiver.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Chat box not found"));

        var message = Message.builder()
                .sender(sender)
                .chatBox(chatBox)
                .receiver(receiver)
                .content(HtmlUtils.htmlEscape(messageRequest.getContent()))
                .build();

        chatBox.getHistory().add(message);
        chatBox.setLastMessage(message);
        chatBoxRepository.save(chatBox);
        assert chatBox.getLastMessage() != null;
        return messageDtoMapper.apply(chatBox.getLastMessage());
    }

    public ChatBoxDto getChatBoxById(Long chatBoxId) {

        var chatBox = chatBoxRepository.findById(chatBoxId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat box not found"));

        securityUtils.ensureOneOfTwoResourceOwnership(chatBox.getUserA().getId(), chatBox.getUserB().getId());

        return chatBoxDtoMapper.apply(chatBox);
    }

    public List<ChatBoxDto> getUserChatBoxes(String userId, int page) {

        securityUtils.ensureResourceOwnership(userId);

        page = Math.max(page, 1);
        var pageable = PageRequest.of(page - 1, 20);

        return chatBoxRepository.findAllByUserId(userId, pageable)
                .map(chatBoxDtoMapper)
                .toList();
    }

    public List<MessageDto> getChatBoxUpdates(Long chatBoxId) {

        var chatBox = chatBoxRepository.findById(chatBoxId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat box not found"));

        securityUtils.ensureOneOfTwoResourceOwnership(
                chatBox.getUserA().getId(),
                chatBox.getUserB().getId()
        );

        var thirtySecondsAgo = Instant.now().minusSeconds(30);

        return messageRepository.findAllByChatBoxIdAndTimestampBeforeThirtySeconds(chatBoxId, thirtySecondsAgo)
                .stream()
                .map(messageDtoMapper)
                .toList();
    }

    public List<MessageDto> getChatBoxHistory(Long chatBoxId, int page) {

        var chatBox = chatBoxRepository.findById(chatBoxId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat box not found"));

        securityUtils.ensureOneOfTwoResourceOwnership(
                chatBox.getUserA().getId(),
                chatBox.getUserB().getId()
        );

        page = Math.max(page, 1);
        var pageable = PageRequest.of(page - 1, 20);

        return messageRepository.findAllByChatBoxId(chatBoxId, pageable)
                .map(messageDtoMapper)
                .toList();
    }

    public ChatBoxDto findOrCreateChatBox(String userIdA, String userIdB) {
        securityUtils.ensureOneOfTwoResourceOwnership(userIdA, userIdB);

        var userA = appUserRepository.findById(userIdA)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var userB = appUserRepository.findById(userIdB)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return chatBoxDtoMapper.apply(chatBoxRepository.findByUsers(userIdA, userIdB)
                .orElseGet(() -> createChatBox(userA, userB)));
    }

    public ChatBox createChatBox(AppUser userA, AppUser userB) {

        if (userA.getId().compareTo(userB.getId()) > 0) {
            var tmp = userA;
            userA = userB;
            userB = tmp;
        }

        return chatBoxRepository.save(ChatBox.builder()
                .userA(userA)
                .userB(userB)
                .build()
        );
    }
}
