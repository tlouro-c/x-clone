package tc.tlouro_c.twitter_api.chatBox;

import tc.tlouro_c.twitter_api.appUser.AppUserDto;
import tc.tlouro_c.twitter_api.message.MessageDto;

public record ChatBoxDto(
        Long id,
        AppUserDto userA,
        AppUserDto userB,
        MessageDto lastMessage
) { }
