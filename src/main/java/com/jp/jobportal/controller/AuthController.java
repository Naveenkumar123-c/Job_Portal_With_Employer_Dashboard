package com.jp.jobportal.controller;

import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jp.jobportal.entity.User;
import com.jp.jobportal.repository.UserRepository;
import com.jp.jobportal.service.LoginNotificationService;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {

    private final UserRepository userRepository;
    private final LoginNotificationService loginNotificationService;

    public AuthController(
            UserRepository userRepository,
            LoginNotificationService loginNotificationService) {

        this.userRepository = userRepository;
        this.loginNotificationService = loginNotificationService;
    }

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register.html";
    }

    @PostMapping("/register")
    public String registerUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role) {

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return "redirect:/register.html";
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role.toLowerCase());

        userRepository.save(user);

        return "redirect:/index.html";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "forward:/index.html";
    }

    @PostMapping("/login")
    public String loginUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role,
            HttpSession session) {

        Optional<User> user =
                userRepository.findByEmailAndRole(
                        email,
                        role.toLowerCase()
                );

        if (user.isEmpty()) {
            return "redirect:/index.html?error=Invalid%20email%20or%20password";
        }

        User loggedInUser = user.get();

        if (!loggedInUser.getPassword().equals(password)) {
            return "redirect:/index.html?error=Invalid%20email%20or%20password";
        }

        session.setAttribute(
                "userId",
                loggedInUser.getId()
        );

        session.setAttribute(
                "userName",
                loggedInUser.getName()
        );

        session.setAttribute(
                "userEmail",
                loggedInUser.getEmail()
        );

        session.setAttribute(
                "userRole",
                loggedInUser.getRole()
        );

        // Login notification email.
        // Email failure will not prevent login.
        try {
            loginNotificationService.sendLoginNotification(
                    loggedInUser.getEmail()
            );
        } catch (Exception e) {
            System.err.println(
                    "Login notification email could not be sent: "
                            + e.getMessage()
            );
        }

        if ("candidate".equalsIgnoreCase(
                loggedInUser.getRole())) {

            return "redirect:/candidate-dashboard.html";
        }

        if ("employer".equalsIgnoreCase(
                loggedInUser.getRole())) {

            return "redirect:/employer-dashboard.html";
        }

        return "redirect:/index.html";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {

        session.invalidate();

        return "redirect:/index.html";
    }
}