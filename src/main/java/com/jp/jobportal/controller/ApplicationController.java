package com.jp.jobportal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jp.jobportal.entity.Application;
import com.jp.jobportal.entity.CandidateProfile;
import com.jp.jobportal.entity.User;
import com.jp.jobportal.repository.ApplicationRepository;
import com.jp.jobportal.repository.CandidateProfileRepository;
import com.jp.jobportal.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    /*
     * Absolute resume upload directory
     */
    private final Path uploadDirectory =
            Paths.get(
                    System.getProperty("user.dir"),
                    "uploads",
                    "resumes"
            )
            .toAbsolutePath()
            .normalize();

    public ApplicationController(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.candidateProfileRepository =
                candidateProfileRepository;
    }

    // =====================================================
    // GET ALL APPLICATIONS
    // =====================================================

    @GetMapping
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }

    // =====================================================
    // GET MY APPLICATIONS
    // =====================================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(
            HttpSession session) {

        Object userIdObject =
                session.getAttribute("userId");

        if (userIdObject == null) {

            return ResponseEntity
                    .status(401)
                    .body("Please login first");
        }

        Long userId;

        try {

            userId =
                    Long.valueOf(
                            userIdObject.toString()
                    );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .status(400)
                    .body("Invalid user session");
        }

        User user =
                userRepository
                        .findById(userId)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(404)
                    .body("User not found");
        }

        String userEmail =
                user.getEmail();

        if (userEmail == null ||
                userEmail.trim().isEmpty()) {

            return ResponseEntity
                    .status(400)
                    .body("User email not found");
        }

        List<Application> applications =
                applicationRepository
                        .findByEmailIgnoreCase(
                                userEmail.trim()
                        );

        return ResponseEntity.ok(applications);
    }

    // =====================================================
    // GET APPLICATION BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {

        return applicationRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =====================================================
    // CREATE APPLICATION
    // =====================================================

    @PostMapping
    public ResponseEntity<Application> createApplication(
            @RequestBody Application application) {

        if (application.getStatus() == null ||
                application.getStatus().isBlank()) {

            application.setStatus("Pending");
        }

        Application savedApplication =
                applicationRepository.save(application);

        return ResponseEntity.ok(savedApplication);
    }

    // =====================================================
    // UPDATE APPLICATION STATUS
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationRepository
                .findById(id)
                .map(application -> {

                    application.setStatus(status);

                    Application updated =
                            applicationRepository
                                    .save(application);

                    return ResponseEntity.ok(updated);
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =====================================================
    // DOWNLOAD CANDIDATE RESUME
    // =====================================================

    @GetMapping("/{id}/resume")
    public ResponseEntity<?> downloadCandidateResume(
            @PathVariable Long id) {

        // -------------------------------------------------
        // 1. Find application
        // -------------------------------------------------

        Application application =
                applicationRepository
                        .findById(id)
                        .orElse(null);

        if (application == null) {

            return ResponseEntity
                    .status(404)
                    .body("Application not found");
        }

        // -------------------------------------------------
        // 2. Get candidate email
        // -------------------------------------------------

        String email =
                application.getEmail();

        if (email == null ||
                email.trim().isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body("Candidate email not found");
        }

        // -------------------------------------------------
        // 3. Find candidate user
        // -------------------------------------------------

        User candidate =
                userRepository
                        .findByEmailIgnoreCase(
                                email.trim()
                        )
                        .orElse(null);

        if (candidate == null) {

            return ResponseEntity
                    .status(404)
                    .body("Candidate user not found");
        }

        // -------------------------------------------------
        // 4. Find candidate profile
        // -------------------------------------------------

        CandidateProfile profile =
                candidateProfileRepository
                        .findByUserId(
                                candidate.getId()
                        )
                        .orElse(null);

        if (profile == null) {

            return ResponseEntity
                    .status(404)
                    .body("Candidate profile not found");
        }

        // -------------------------------------------------
        // 5. Get resume filename
        // -------------------------------------------------

        String resumeName =
                profile.getResume();

        if (resumeName == null ||
                resumeName.trim().isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            "Candidate has not uploaded a resume"
                    );
        }

        try {

            // -------------------------------------------------
            // 6. Make sure upload directory exists
            // -------------------------------------------------

            if (!Files.exists(uploadDirectory)) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "Resume upload directory not found: "
                                        + uploadDirectory
                        );
            }

            // -------------------------------------------------
            // 7. Build absolute resume path
            // -------------------------------------------------

            Path filePath =
                    uploadDirectory
                            .resolve(resumeName.trim())
                            .normalize();

            // -------------------------------------------------
            // 8. Security check
            // -------------------------------------------------

            if (!filePath.startsWith(uploadDirectory)) {

                return ResponseEntity
                        .status(400)
                        .body("Invalid resume file");
            }

            // -------------------------------------------------
            // 9. Check resume exists
            // -------------------------------------------------

            if (!Files.exists(filePath)) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "Resume file not found: "
                                        + filePath
                        );
            }

            // -------------------------------------------------
            // 10. Check it is a regular file
            // -------------------------------------------------

            if (!Files.isRegularFile(filePath)) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "Resume is not a valid file"
                        );
            }

            // -------------------------------------------------
            // 11. Create Resource
            // -------------------------------------------------

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists() ||
                    !resource.isReadable()) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "Resume file cannot be read"
                        );
            }

            // -------------------------------------------------
            // 12. Detect content type
            // -------------------------------------------------

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {

                if (resumeName
                        .toLowerCase()
                        .endsWith(".docx")) {

                    contentType =
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                } else if (resumeName
                        .toLowerCase()
                        .endsWith(".doc")) {

                    contentType =
                            "application/msword";

                } else if (resumeName
                        .toLowerCase()
                        .endsWith(".pdf")) {

                    contentType =
                            "application/pdf";

                } else {

                    contentType =
                            "application/octet-stream";
                }
            }

            // -------------------------------------------------
            // 13. Return file as download
            // -------------------------------------------------

            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    resumeName.trim() +
                                    "\""
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            contentType
                    )
                    .body(resource);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to download resume: "
                                    + e.getMessage()
                    );
        }
    }
}