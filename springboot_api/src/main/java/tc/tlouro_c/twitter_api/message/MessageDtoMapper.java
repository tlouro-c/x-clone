package tc.tlouro_c.twitter_api.message;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tc.tlouro_c.twitter_api.appUser.AppUserDtoMapper;

import java.util.function.Function;

@RequiredArgsConstructor
@Component
public class MessageDtoMapper implements Function<Message, MessageDto> {

    private final AppUserDtoMapper appUserDtoMapper;

    @Override
    public MessageDto apply(Message message) {
        return new MessageDto(
                message.getId(),
                appUserDtoMapper.apply(message.getSender()),
                appUserDtoMapper.apply(message.getReceiver()),
                message.getTimestamp(),
                message.getContent()
        );
    }
}
