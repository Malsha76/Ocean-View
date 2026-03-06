package com.oceanview.config;

import com.oceanview.domain.RoomType;
import com.oceanview.domain.User;
import com.oceanview.repository.RoomTypeRepository;
import com.oceanview.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Configuration
public class DataInitializer {
    private static final String DEFAULT_ADMIN_USERNAME = "admin@gmail.com";
    private static final String LEGACY_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    @Bean
    public CommandLineRunner init(RoomTypeRepository roomTypeRepository,
                                  UserRepository userRepository,
                                  PasswordEncoder passwordEncoder) {
        return args -> {
            if (roomTypeRepository.count() == 0) {
                roomTypeRepository.saveAll(List.of(
                        createRoomType("STANDARD", "Standard Room", "100.00"),
                        createRoomType("DELUXE", "Deluxe Room", "150.00"),
                        createRoomType("SUITE", "Suite", "250.00")
                ));
            }
            Optional<User> defaultAdmin = userRepository.findByUsername(DEFAULT_ADMIN_USERNAME);
            if (defaultAdmin.isPresent()) {
                User admin = defaultAdmin.get();
                admin.setPasswordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
            } else if (userRepository.findByUsername(LEGACY_ADMIN_USERNAME).isPresent()) {
                User admin = userRepository.findByUsername(LEGACY_ADMIN_USERNAME).orElseThrow();
                admin.setUsername(DEFAULT_ADMIN_USERNAME);
                admin.setPasswordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
            } else {
                User admin = new User();
                admin.setUsername(DEFAULT_ADMIN_USERNAME);
                admin.setPasswordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("staff1").isEmpty()) {
                User staff = new User();
                staff.setUsername("staff1");
                staff.setPasswordHash(passwordEncoder.encode("staff123"));
                staff.setRole("STAFF");
                staff.setEnabled(true);
                userRepository.save(staff);
            }
        };
    }

    private static RoomType createRoomType(String code, String name, String rate) {
        RoomType rt = new RoomType();
        rt.setCode(code);
        rt.setName(name);
        rt.setRatePerNight(new BigDecimal(rate));
        return rt;
    }
}
