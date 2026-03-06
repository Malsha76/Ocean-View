package com.oceanview.controller;

import com.oceanview.domain.User;
import com.oceanview.dto.CreateUserRequest;
import com.oceanview.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createStaffAccount(@Valid @RequestBody CreateUserRequest request) {
        String username = request.getUsername().trim().toLowerCase();
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("STAFF");
        user.setEnabled(true);
        user = userRepository.save(user);
        user.setPasswordHash(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/users/{id}/disable")
    public ResponseEntity<Map<String, Object>> disableUser(@PathVariable String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(false);
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.<String, Object>of("id", user.getId(), "enabled", false));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsers() {
        List<Map<String, Object>> list = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "role", u.getRole(),
                        "enabled", u.isEnabled()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
