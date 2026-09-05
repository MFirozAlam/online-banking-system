package com.bankingsystem.service;

import com.bankingsystem.dto.AccountDto;

import java.util.List;

public interface AccountService {
    AccountDto create(AccountDto accountDto);

    AccountDto getAccountById(Long id);

    AccountDto deposit(Long id,double amount);

    AccountDto withdraw(Long id,double amount);

    List<AccountDto> getAllAccounts();

    void deleteAccount(Long id);
}
