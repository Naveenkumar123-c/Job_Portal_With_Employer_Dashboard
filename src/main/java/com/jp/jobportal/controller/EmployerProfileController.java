package com.jp.jobportal.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jp.jobportal.entity.EmployerProfile;
import com.jp.jobportal.repository.EmployerProfileRepository;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class EmployerProfileController {

    private final EmployerProfileRepository repository;

    public EmployerProfileController(EmployerProfileRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public EmployerProfile saveProfile(@RequestBody EmployerProfile profile) {
        return repository.save(profile);
    }

    @GetMapping("/{id}")
    public EmployerProfile getProfile(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }
}