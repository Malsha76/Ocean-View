package com.oceanview.service;

import com.oceanview.domain.User;
import com.oceanview.dto.AuthResponse;
import com.oceanview.dto.LoginRequest;
import com.oceanview.dto.SignupRequest;
import com.oceanview.security.JwtService;
import com.oceanview.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final String HARDCODED_ADMIN_USERNAME = "admin@gmail.com";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername().trim().toLowerCase();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        if ("ADMIN".equalsIgnoreCase(user.getRole()) && !HARDCODED_ADMIN_USERNAME.equalsIgnoreCase(user.getUsername())) {
            throw new RuntimeException("Only the default admin account is allowed");
        }
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse signup(SignupRequest request) {
        String username = request.getUsername().trim().toLowerCase();
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        String requestedRole = request.getRole() == null ? "CUSTOMER" : request.getRole().trim().toUpperCase();
        if (!requestedRole.equals("CUSTOMER")) {
            throw new RuntimeException("Self-signup is only available for customer accounts");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");
        user.setEnabled(true);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }
}
