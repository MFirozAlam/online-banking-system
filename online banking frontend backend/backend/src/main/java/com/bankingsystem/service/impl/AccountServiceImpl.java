package com.bankingsystem.service.impl;

import com.bankingsystem.dto.AccountDto;
import com.bankingsystem.mapper.AccountMapper;
import com.bankingsystem.model.Account;
import com.bankingsystem.model.Transaction;
import com.bankingsystem.repository.AccountRepository;
import com.bankingsystem.repository.TransactionRepository;
import com.bankingsystem.service.AccountService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountServiceImpl(AccountRepository accountRepository,
                              TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public AccountDto create(AccountDto dto) {
        if (dto == null || dto.getAccountHolderName() == null || dto.getAccountHolderName().isBlank()) {
            throw new IllegalArgumentException("Account holder name is required");
        }
        validateBalance(dto.getBalance());

        String type = dto.getAccountType();
        if (type == null || type.isBlank()) type = "SAVINGS";
        type = type.trim().toUpperCase();
        if (!type.equals("SAVINGS") && !type.equals("CURRENT")) {
            throw new IllegalArgumentException("Account type must be SAVINGS or CURRENT");
        }

        Account account = new Account();
        account.setAccountHolderName(dto.getAccountHolderName().trim());
        account.setAccountType(type);
        account.setBalance(dto.getBalance());

        Account saved = accountRepository.save(account);

        if (dto.getBalance() > 0) {
            saveTransaction(saved, "DEPOSIT", dto.getBalance(), null);
        }
        return AccountMapper.mapToAccountDto(saved);
    }

    @Override
    public AccountDto getAccountById(Long id) {
        return AccountMapper.mapToAccountDto(findAccount(id));
    }

    @Override
    @Transactional
    public AccountDto deposit(Long id, double amount) {
        validateAmount(amount);
        Account account = findAccount(id);
        account.setBalance(account.getBalance() + amount);
        Account saved = accountRepository.save(account);
        saveTransaction(saved, "DEPOSIT", amount, null);
        return AccountMapper.mapToAccountDto(saved);
    }

    @Override
    @Transactional
    public AccountDto withdraw(Long id, double amount) {
        validateAmount(amount);
        Account account = findAccount(id);
        if (account.getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        account.setBalance(account.getBalance() - amount);
        Account saved = accountRepository.save(account);
        saveTransaction(saved, "WITHDRAWAL", amount, null);
        return AccountMapper.mapToAccountDto(saved);
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(AccountMapper::mapToAccountDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteAccount(Long id) {
        Account account = findAccount(id);
        transactionRepository.deleteByAccountId(id);
        transactionRepository.deleteByReceiverAccountId(id);
        accountRepository.delete(account);
    }

    private Account findAccount(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid account id");
        return accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
    }

    private void validateAmount(double amount) {
        if (!Double.isFinite(amount) || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
    }

    private void validateBalance(double balance) {
        if (!Double.isFinite(balance) || balance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
    }

    private void saveTransaction(Account account, String type, double amount, Account receiver) {
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setReceiverAccount(receiver);
        tx.setType(type);
        tx.setAmount(BigDecimal.valueOf(amount));
        transactionRepository.save(tx);
    }
}
