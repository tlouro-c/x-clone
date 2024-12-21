package tc.tlouro_c.twitter_api.message;

import tc.tlouro_c.twitter_api.appUser.AppUserDto;

import java.time.Instant;

public record MessageDto(
        Long id,
        AppUserDto sender,
        AppUserDto receiver,
        Instant timestamp,
        String content
) {
}
