package tc.tlouro_c.twitter_api.chatBox;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tc.tlouro_c.twitter_api.message.MessageDto;
import tc.tlouro_c.twitter_api.message.MessageRequest;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat-box")
public class ChatBoxController {

    private final ChatBoxService chatBoxService;

    @GetMapping
    public ResponseEntity<List<ChatBoxDto>> getUserChatBoxes(
            @RequestParam(name = "user") String userId,
            @RequestParam(name = "page") int page) {

        return new ResponseEntity<>(chatBoxService.getUserChatBoxes(userId, page),
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ChatBoxDto> createChatBox(
            @RequestBody ChatBoxRequest chatBoxRequest) {
        return new ResponseEntity<>(chatBoxService.findOrCreateChatBox(chatBoxRequest.getUserAId(), chatBoxRequest.getUserBId()),
                HttpStatus.CREATED);
    }

    @PostMapping("/new-message")
    public ResponseEntity<MessageDto> saveMessage(
            @RequestBody MessageRequest messageRequest) {
        return new ResponseEntity<>(chatBoxService.saveMessage(messageRequest),
                HttpStatus.CREATED);
    }

    @GetMapping("/{chatBoxId}")
    public ResponseEntity<ChatBoxDto> getChatBoxById(@PathVariable Long chatBoxId) {
        return new ResponseEntity<>(chatBoxService.getChatBoxById(chatBoxId),
                HttpStatus.OK);
    }

    @GetMapping("/{chatBoxId}/history")
    public ResponseEntity<List<MessageDto>> getChatBoxHistory(
            @PathVariable Long chatBoxId,
            @RequestParam(name = "page") int page) {
        return new ResponseEntity<>(chatBoxService.getChatBoxHistory(chatBoxId, page),
                HttpStatus.OK);
    }

    @GetMapping("/{chatBoxId}/updates")
    public ResponseEntity<List<MessageDto>> getChatBoxUpdates(
            @PathVariable Long chatBoxId) {
        return new ResponseEntity<>(chatBoxService.getChatBoxUpdates(chatBoxId),
                HttpStatus.OK);
    }

}
