package com.jp.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jp.jobportal.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
}