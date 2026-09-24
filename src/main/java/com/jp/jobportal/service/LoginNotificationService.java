package com.jp.jobportal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class LoginNotificationService {

    private final JavaMailSender mailSender;

    public LoginNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendLoginNotification(String email) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("New Login Detected - Job Portal");

        message.setText(
                "Hello,\n\n" +
                "A successful login was detected on your Job Portal account.\n\n" +
                "If this was you, no action is required.\n\n" +
                "If you did not perform this login, please change your password " +
                "and contact the administrator.\n\n" +
                "Regards,\n" +
                "Job Portal"
        );

        mailSender.send(message);
    }
}