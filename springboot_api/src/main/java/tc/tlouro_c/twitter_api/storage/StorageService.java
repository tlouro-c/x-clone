package tc.tlouro_c.twitter_api.storage;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import tc.tlouro_c.twitter_api.exceptions.ResourceNotFoundException;
import tc.tlouro_c.twitter_api.exceptions.StorageException;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Service
public class StorageService {

    private final Path rootLocation;

    public StorageService(@Value("${file.upload-dir:/app/uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
    }

    public Path store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }

            String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            String newFilename = UUID.randomUUID() + "." + fileExtension;

            if (!Arrays.asList("jpg", "jpeg", "png").contains(fileExtension)) {
                throw new StorageException("Invalid file type. Only JPG, JPEG, and PNG are allowed.");
            }

            Path destinationFile = this.rootLocation.resolve(
                            Paths.get(newFilename))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new StorageException("Cannot store file outside current directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            return destinationFile;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    public Resource loadAsResource(String filename) {
        try {

            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new ResourceNotFoundException(
                        "Could not read file: " + filename);
            }
        }
        catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Could not read file: " + filename);
        }
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}
