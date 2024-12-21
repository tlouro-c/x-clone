package tc.tlouro_c.twitter_api.follow;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tc.tlouro_c.twitter_api.appUser.AppUserDto;
import tc.tlouro_c.twitter_api.utils.BasicApiResponse;

import java.util.List;

@RestController @RequiredArgsConstructor
@RequestMapping("/api/v1/follows")
public class FollowController {

    private final FollowService followService;

    @PostMapping
    public ResponseEntity<FollowDto> saveFollow(@RequestBody FollowForm followForm) {

        return new ResponseEntity<>(followService.saveFollow(followForm),
                HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<BasicApiResponse> deleteFollow(@RequestBody FollowForm followForm) {
        followService.deleteFollow(followForm);

        return new ResponseEntity<>(new BasicApiResponse("Follow deleted successfully"),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<List<AppUserDto>> getUserFollows(
            @RequestParam(name = "user") String userId,
            @RequestParam(name = "page") int page,
            @RequestParam(name = "type") String type
    ) {
        List<AppUserDto> responseBody;
        if (type.equals("followers")) {
            responseBody = followService.getUserFollowers(userId, page);
        } else if (type.equals("following")) {
            responseBody = followService.getUserFollowings(userId, page);
        } else {
            throw new IllegalArgumentException("Invalid type: must be 'followers' or 'following'");
        }
        return new ResponseEntity<>(responseBody,
                HttpStatus.OK);
    }
}
