package com.bankingsystem.service;

import com.bankingsystem.dto.LoginRequest;
import com.bankingsystem.dto.RegisterRequest;
import com.bankingsystem.dto.UserDto;

public interface AuthService {

    UserDto register(RegisterRequest registerRequest);

    UserDto login(LoginRequest loginRequest);
}