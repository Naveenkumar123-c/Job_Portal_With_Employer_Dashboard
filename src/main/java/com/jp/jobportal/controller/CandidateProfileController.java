package com.jp.jobportal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jp.jobportal.entity.CandidateProfile;
import com.jp.jobportal.entity.User;
import com.jp.jobportal.repository.CandidateProfileRepository;
import com.jp.jobportal.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin
public class CandidateProfileController {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/resumes");

    public CandidateProfileController(
            CandidateProfileRepository profileRepository,
            UserRepository userRepository) {

        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // GET MY PROFILE
    // =========================

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            HttpSession session) {

        Object userIdObject =
                session.getAttribute("userId");

        if (userIdObject == null) {
            return ResponseEntity.status(401)
                    .body("Please login first");
        }

        Long userId =
                Long.valueOf(userIdObject.toString());

        User user =
                userRepository.findById(userId)
                        .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body("User not found");
        }

        Optional<CandidateProfile> profile =
                profileRepository.findByUserId(userId);

        if (profile.isPresent()) {
            return ResponseEntity.ok(
                    createProfileResponse(
                            user,
                            profile.get()
                    )
            );
        }

        return ResponseEntity.ok(
                createProfileResponse(
                        user,
                        null
                )
        );
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @RequestParam String phone,
            @RequestParam String qualification,
            @RequestParam String skills,
            @RequestParam(required = false)
            MultipartFile resume,
            HttpSession session) {

        Object userIdObject =
                session.getAttribute("userId");

        if (userIdObject == null) {
            return ResponseEntity.status(401)
                    .body("Please login first");
        }

        Long userId =
                Long.valueOf(userIdObject.toString());

        User user =
                userRepository.findById(userId)
                        .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body("User not found");
        }

        CandidateProfile profile =
                profileRepository
                        .findByUserId(userId)
                        .orElse(new CandidateProfile());

        profile.setUserId(userId);
        profile.setPhone(phone);
        profile.setQualification(qualification);
        profile.setSkills(skills);

        // =========================
        // RESUME UPLOAD
        // =========================

        if (resume != null &&
                !resume.isEmpty()) {

            String originalFilename =
                    resume.getOriginalFilename();

            if (originalFilename == null ||
                    originalFilename.isBlank()) {

                return ResponseEntity.badRequest()
                        .body("Invalid resume file");
            }

            String lowerFilename =
                    originalFilename.toLowerCase();

            if (!lowerFilename.endsWith(".pdf") &&
                !lowerFilename.endsWith(".doc") &&
                !lowerFilename.endsWith(".docx")) {

                return ResponseEntity.badRequest()
                        .body(
                            "Only PDF, DOC and DOCX files are allowed"
                        );
            }

            try {

                Files.createDirectories(
                        uploadDirectory
                );

                String extension = "";

                int dotIndex =
                        originalFilename.lastIndexOf(".");

                if (dotIndex >= 0) {
                    extension =
                            originalFilename.substring(
                                    dotIndex
                            );
                }

                String storedFilename =
                        UUID.randomUUID()
                                .toString()
                        + extension;

                Path filePath =
                        uploadDirectory.resolve(
                                storedFilename
                        );

                Files.copy(
                        resume.getInputStream(),
                        filePath
                );

                profile.setResume(
                        storedFilename
                );

            } catch (IOException e) {

                return ResponseEntity
                        .internalServerError()
                        .body(
                            "Failed to upload resume"
                        );
            }
        }

        CandidateProfile savedProfile =
                profileRepository.save(profile);

        return ResponseEntity.ok(
                createProfileResponse(
                        user,
                        savedProfile
                )
        );
    }

    // =========================
    // DOWNLOAD / VIEW RESUME
    // =========================

    @GetMapping("/resume")
    public ResponseEntity<?> downloadResume(
            HttpSession session) {

        Object userIdObject =
                session.getAttribute("userId");

        if (userIdObject == null) {
            return ResponseEntity.status(401)
                    .body("Please login first");
        }

        Long userId =
                Long.valueOf(userIdObject.toString());

        CandidateProfile profile =
                profileRepository
                        .findByUserId(userId)
                        .orElse(null);

        if (profile == null ||
                profile.getResume() == null ||
                profile.getResume().isBlank()) {

            return ResponseEntity.status(404)
                    .body("No resume uploaded");
        }

        try {

            Path filePath =
                    uploadDirectory.resolve(
                            profile.getResume()
                    ).normalize();

            if (!Files.exists(filePath)) {

                return ResponseEntity.status(404)
                        .body("Resume file not found");
            }

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {
                contentType =
                        "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                            profile.getResume() +
                            "\""
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            contentType
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to open resume"
                    );
        }
    }

    // =========================
    // RESPONSE
    // =========================

    private ProfileResponse createProfileResponse(
            User user,
            CandidateProfile profile) {

        ProfileResponse response =
                new ProfileResponse();

        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        if (profile != null) {

            response.setPhone(
                    profile.getPhone()
            );

            response.setQualification(
                    profile.getQualification()
            );

            response.setSkills(
                    profile.getSkills()
            );

            response.setResume(
                    profile.getResume()
            );
        }

        return response;
    }

    // =========================
    // RESPONSE CLASS
    // =========================

    public static class ProfileResponse {

        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String qualification;
        private String skills;
        private String resume;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getQualification() {
            return qualification;
        }

        public void setQualification(String qualification) {
            this.qualification = qualification;
        }

        public String getSkills() {
            return skills;
        }

        public void setSkills(String skills) {
            this.skills = skills;
        }

        public String getResume() {
            return resume;
        }

        public void setResume(String resume) {
            this.resume = resume;
        }
    }
}