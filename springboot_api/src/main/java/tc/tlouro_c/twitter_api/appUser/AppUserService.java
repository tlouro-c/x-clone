package tc.tlouro_c.twitter_api.appUser;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.multipart.MultipartFile;
import tc.tlouro_c.twitter_api.authentication.AuthenticationService;
import tc.tlouro_c.twitter_api.exceptions.BadAuthenticationException;
import tc.tlouro_c.twitter_api.exceptions.InternalServerErrorException;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.storage.StorageService;
import tc.tlouro_c.twitter_api.utils.SecurityUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppUserDtoMapper appUserDtoMapper;
    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;
    private final StorageService storageService;

    public AppUserDto getUser(String userId) {
        var user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return appUserDtoMapper.apply(user);
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @Transactional
    public AppUserDto updateUser(AppUserUpdateRequest userUpdateRequest) {
        securityUtils.ensureResourceOwnership(userUpdateRequest.getId());

        var user = appUserRepository.findById(userUpdateRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (userUpdateRequest.getUsername() != null) {
            user.setUsername(userUpdateRequest.getUsername());
        }

        if (userUpdateRequest.getName() != null) {
            user.setName(userUpdateRequest.getName());
        }

        var emailWasUpdated = userUpdateRequest.getEmail() != null && !userUpdateRequest.getEmail().equals(user.getEmail());
        if (emailWasUpdated) {
            user.setEmail(userUpdateRequest.getEmail());
            user.setEnabled(false);
        }

        if (userUpdateRequest.getPassword() != null) {
            if (userUpdateRequest.getRepeatPassword() == null ||
                    !userUpdateRequest.getPassword().equals(userUpdateRequest.getRepeatPassword()) ) {
                throw new BadAuthenticationException("The passwords do not match");
            }
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }
        appUserRepository.save(user);
        if (emailWasUpdated) {
            authenticationService.sendEmailConfirmation(user, true);
        }
        return appUserDtoMapper.apply(user);
    }

    public AppUserDto updateUserAvatar(String userId, MultipartFile file) {
        securityUtils.ensureResourceOwnership(userId);

        var user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var uploadedAvatar = storageService.store(file);

        user.setAvatar(uploadedAvatar.getFileName().toString());

        return appUserDtoMapper.apply(appUserRepository.save(user));
    }

    public AppUserDto deleteUser(AppUserDeleteRequest userDeleteRequest) {
        securityUtils.ensureResourceOwnership(userDeleteRequest.getId());

        var user = appUserRepository.findById(userDeleteRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(userDeleteRequest.getPassword(), user.getPassword())) {
            throw new BadAuthenticationException("The password is incorrect.");
        }

        appUserRepository.delete(user);
        return appUserDtoMapper.apply(user);
    }

    public List<AppUserDto> searchUser(String toMatch, int page) {

        page = Math.max(page, 1);
        var pageable = PageRequest.of(page - 1, 20);

        var searchResultsPage = appUserRepository.findByNameOrUsername(toMatch, pageable);

        return searchResultsPage
                .stream()
                .map(appUserDtoMapper)
                .toList();
    }
}
