package com.oceanview.service;

import com.oceanview.domain.User;
import com.oceanview.dto.LoginRequest;
import com.oceanview.dto.SignupRequest;
import com.oceanview.repository.UserRepository;
import com.oceanview.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_returnsToken_whenCredentialsValid() {
        User user = new User();
        user.setUsername("staff1");
        user.setPasswordHash("$2a$10$hashed");
        user.setRole("STAFF");
        user.setEnabled(true);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("staff123", user.getPasswordHash())).thenReturn(true);
        when(jwtService.generateToken("staff1", "STAFF")).thenReturn("jwt.token.here");

        LoginRequest req = new LoginRequest();
        req.setUsername("staff1");
        req.setPassword("staff123");

        var response = authService.login(req);

        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        assertThat(response.getUsername()).isEqualTo("staff1");
        assertThat(response.getRole()).isEqualTo("STAFF");
    }

    @Test
    void login_throws_whenPasswordInvalid() {
        User user = new User();
        user.setUsername("staff1");
        user.setPasswordHash("$2a$10$hashed");
        user.setEnabled(true);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", user.getPasswordHash())).thenReturn(false);

        LoginRequest req = new LoginRequest();
        req.setUsername("staff1");
        req.setPassword("wrong");

        assertThatThrownBy(() -> authService.login(req))
                .hasMessageContaining("Invalid");
    }

    @Test
    void login_throws_whenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());
        LoginRequest req = new LoginRequest();
        req.setUsername("unknown");
        req.setPassword("any");

        assertThatThrownBy(() -> authService.login(req))
                .hasMessageContaining("Invalid");
    }

    @Test
    void signup_throws_whenRoleIsStaff() {
        SignupRequest req = new SignupRequest();
        req.setUsername("newstaff");
        req.setPassword("staff123");
        req.setRole("STAFF");

        assertThatThrownBy(() -> authService.signup(req))
                .hasMessageContaining("customer");
    }

    @Test
    void signup_createsCustomer_whenRoleIsCustomer() {
        when(userRepository.existsByUsername("customer2")).thenReturn(false);
        when(passwordEncoder.encode("customer123")).thenReturn("encoded");
        when(jwtService.generateToken("customer2", "CUSTOMER")).thenReturn("jwt.customer.token");

        SignupRequest req = new SignupRequest();
        req.setUsername("customer2");
        req.setPassword("customer123");
        req.setRole("CUSTOMER");

        var response = authService.signup(req);

        assertThat(response.getToken()).isEqualTo("jwt.customer.token");
        assertThat(response.getUsername()).isEqualTo("customer2");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_throws_whenRoleIsAdmin() {
        SignupRequest req = new SignupRequest();
        req.setUsername("admin2");
        req.setPassword("admin123");
        req.setRole("ADMIN");

        assertThatThrownBy(() -> authService.signup(req))
                .hasMessageContaining("customer");
    }
}
