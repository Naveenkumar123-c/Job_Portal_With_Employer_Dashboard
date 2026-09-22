package com.jp.jobportal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jp.jobportal.entity.EmployerProfile;
import com.jp.jobportal.repository.EmployerProfileRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class EmployerProfileController {

    private final EmployerProfileRepository profileRepository;

    public EmployerProfileController(
            EmployerProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Get logged-in employer profile
    @GetMapping("/me")
    public EmployerProfile getMyProfile(HttpSession session) {

        Object userIdObject = session.getAttribute("userId");

        if (userIdObject == null) {
            throw new RuntimeException("User not logged in");
        }

        Long userId = Long.valueOf(userIdObject.toString());

        return profileRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employer profile not found"));
    }

    // Create employer profile
    @PostMapping
    public EmployerProfile createProfile(
            @RequestBody EmployerProfile profile,
            HttpSession session) {

        Object userIdObject = session.getAttribute("userId");

        if (userIdObject == null) {
            throw new RuntimeException("User not logged in");
        }

        Long userId = Long.valueOf(userIdObject.toString());

        profile.setUserId(userId);

        return profileRepository.save(profile);
    }

    // Update logged-in employer profile
    @PutMapping("/me")
    public EmployerProfile updateMyProfile(
            @RequestBody EmployerProfile updatedProfile,
            HttpSession session) {

        Object userIdObject = session.getAttribute("userId");

        if (userIdObject == null) {
            throw new RuntimeException("User not logged in");
        }

        Long userId = Long.valueOf(userIdObject.toString());

        EmployerProfile profile =
                profileRepository.findByUserId(userId)
                        .orElseGet(EmployerProfile::new);

        profile.setUserId(userId);

        profile.setName(updatedProfile.getName());
        profile.setEmail(updatedProfile.getEmail());
        profile.setCompany(updatedProfile.getCompany());
        profile.setPhone(updatedProfile.getPhone());
        profile.setQualification(updatedProfile.getQualification());
        profile.setSkills(updatedProfile.getSkills());

        return profileRepository.save(profile);
    }
}