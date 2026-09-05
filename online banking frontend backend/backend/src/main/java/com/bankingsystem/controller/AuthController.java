package com.bankingsystem.controller;

import com.bankingsystem.dto.LoginRequest;
import com.bankingsystem.dto.RegisterRequest;
import com.bankingsystem.dto.UserDto;
import com.bankingsystem.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @RequestBody RegisterRequest registerRequest) {

        UserDto user = authService.register(registerRequest);

        return new ResponseEntity<>(
                user,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(
            @RequestBody LoginRequest loginRequest) {

        UserDto user = authService.login(loginRequest);

        return ResponseEntity.ok(user);
    }
}