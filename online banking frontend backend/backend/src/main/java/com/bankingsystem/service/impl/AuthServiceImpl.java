package com.bankingsystem.service.impl;

import com.bankingsystem.dto.LoginRequest;
import com.bankingsystem.dto.RegisterRequest;
import com.bankingsystem.dto.UserDto;
import com.bankingsystem.model.User;
import com.bankingsystem.repository.UserRepository;
import com.bankingsystem.service.AuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto register(RegisterRequest request) {
        if (request == null) throw new IllegalArgumentException("Registration data is required");

        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String name = request.getName() == null ? "" : request.getName().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim();

        if (username.isBlank()) throw new IllegalArgumentException("Username is required");
        if (!username.matches("[A-Za-z0-9_]{4,30}")) {
            throw new IllegalArgumentException("Username must be 4-30 characters and contain only letters, numbers or _");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (name.isBlank()) throw new IllegalArgumentException("Name is required");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Enter a valid email address");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(name);
        user.setEmail(email);

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Override
    public UserDto login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Username and password are required");
        }

        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return toDto(user);
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getName(), user.getEmail());
    }
}
