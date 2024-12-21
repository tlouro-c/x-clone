package tc.tlouro_c.twitter_api.chatBox;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;
import tc.tlouro_c.twitter_api.message.MessageDtoMapper;

import java.util.function.Function;

@RequiredArgsConstructor
@Component
public class ChatBoxDtoMapper implements Function<ChatBox, ChatBoxDto> {

    private final AppUserDtoMapper appUserDtoMapper;
    private final MessageDtoMapper messageDtoMapper;

    @Override
    public ChatBoxDto apply(ChatBox chatBox) {
        return new ChatBoxDto(
                chatBox.getId(),
                appUserDtoMapper.apply(chatBox.getUserA()),
                appUserDtoMapper.apply(chatBox.getUserB()),
                chatBox.getLastMessage() != null ? messageDtoMapper.apply(chatBox.getLastMessage()) : null
        );
    }
}
