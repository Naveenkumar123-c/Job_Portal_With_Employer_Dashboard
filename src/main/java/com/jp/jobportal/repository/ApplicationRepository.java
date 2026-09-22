package com.jp.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jp.jobportal.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByEmail(String email);

    List<Application> findByEmailIgnoreCase(String email);
}