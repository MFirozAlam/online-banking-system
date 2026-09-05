package com.bankingsystem.mapper;

import com.bankingsystem.dto.AccountDto;
import com.bankingsystem.model.Account;

public final class AccountMapper {
    private AccountMapper() {}

    public static Account mapToAccount(AccountDto dto) {
        Account account = new Account();
        account.setId(dto.getId());
        account.setAccountHolderName(dto.getAccountHolderName());
        account.setAccountType(dto.getAccountType());
        account.setBalance(dto.getBalance());
        return account;
    }

    public static AccountDto mapToAccountDto(Account account) {
        return new AccountDto(
                account.getId(),
                account.getAccountHolderName(),
                account.getAccountType() == null ? "SAVINGS" : account.getAccountType(),
                account.getBalance()
        );
    }
}
