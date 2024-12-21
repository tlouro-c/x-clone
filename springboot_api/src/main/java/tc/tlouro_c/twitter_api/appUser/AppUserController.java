package tc.tlouro_c.twitter_api.appUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.storage.StorageService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;
    private final StorageService storageService;

    @GetMapping("/{userId}")
    public ResponseEntity<AppUserDto> getUser(@PathVariable String userId) {
        return new ResponseEntity<>(appUserService.getUser(userId),
                HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<AppUserDto> updateUser(@RequestBody @Valid AppUserUpdateRequest appUserUpdateRequest) {
        return new ResponseEntity<>(appUserService.updateUser(appUserUpdateRequest),
                HttpStatus.OK);
    }

    @PutMapping(path = "/{userId}/avatar", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<AppUserDto> updateUserAvatar(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {

        return new ResponseEntity<>(appUserService.updateUserAvatar(userId, file),
                HttpStatus.OK);
    }

    @GetMapping(value = "/avatars/{filename}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<Resource> serveUserAvatar(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);

        if (file == null)
            throw new ResourceNotFoundException("File not found");

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @DeleteMapping
    public ResponseEntity<AppUserDto> deleteUser(@RequestBody @Valid AppUserDeleteRequest appUserDeleteRequest) {
        return new ResponseEntity<>(appUserService.deleteUser(appUserDeleteRequest),
                HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return new ResponseEntity<>(appUserService.getAllUsers(),
                HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppUserDto>> getUsersSearch(
            @RequestParam(name = "toMatch") String toMatch,
            @RequestParam(name = "page") int page
    ) {
        return new ResponseEntity<>(appUserService.searchUser(toMatch, page),
                HttpStatus.OK);
    }
}
