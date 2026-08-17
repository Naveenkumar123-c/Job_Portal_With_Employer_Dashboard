package com.jp.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jp.jobportal.entity.EmployerProfile;

public interface EmployerProfileRepository
        extends JpaRepository<EmployerProfile, Long> {
}