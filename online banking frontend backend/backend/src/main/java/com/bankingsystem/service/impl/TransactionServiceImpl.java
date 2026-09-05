package com.bankingsystem.service.impl;

import com.bankingsystem.dto.TransactionDto;
import com.bankingsystem.model.Account;
import com.bankingsystem.model.Transaction;
import com.bankingsystem.repository.AccountRepository;
import com.bankingsystem.repository.TransactionRepository;
import com.bankingsystem.service.TransactionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(AccountRepository accountRepository,
                                  TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public TransactionDto deposit(Long accountId, double amount) {
        Account account = findAccount(accountId);
        validateAmount(amount);
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
        return toDto(save(account, "DEPOSIT", amount, null));
    }

    @Override
    @Transactional
    public TransactionDto withdraw(Long accountId, double amount) {
        Account account = findAccount(accountId);
        validateAmount(amount);
        if (account.getBalance() < amount) throw new IllegalArgumentException("Insufficient balance");
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);
        return toDto(save(account, "WITHDRAWAL", amount, null));
    }

    @Override
    @Transactional
    public TransactionDto transfer(Long senderId, Long receiverId, double amount) {
        validateAmount(amount);
        if (senderId == null || receiverId == null || senderId.equals(receiverId)) {
            throw new IllegalArgumentException("Sender and receiver accounts must be different");
        }

        Account sender = findAccount(senderId);
        Account receiver = findAccount(receiverId);

        if (sender.getBalance() < amount) throw new IllegalArgumentException("Insufficient balance");

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);
        accountRepository.save(sender);
        accountRepository.save(receiver);

        // Store a transaction in both account histories.
        save(sender, "TRANSFER", amount, receiver);
        Transaction received = save(receiver, "TRANSFER", amount, sender);

        return toDto(received);
    }

    @Override
    public List<TransactionDto> getTransactionsByAccount(Long accountId) {
        findAccount(accountId);
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId)
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAll()
                .stream().map(this::toDto).toList();
    }

    private Account findAccount(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid account id");
        return accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
    }

    private void validateAmount(double amount) {
        if (!Double.isFinite(amount) || amount <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than 0");
        }
    }

    private Transaction save(Account account, String type, double amount, Account receiver) {
        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setReceiverAccount(receiver);
        tx.setType(type);
        tx.setAmount(BigDecimal.valueOf(amount));
        return transactionRepository.save(tx);
    }

    private TransactionDto toDto(Transaction tx) {
        return new TransactionDto(
                tx.getId(),
                tx.getAccount().getId(),
                tx.getReceiverAccount() == null ? null : tx.getReceiverAccount().getId(),
                tx.getType(),
                tx.getAmount(),
                tx.getTransactionDate()
        );
    }
}
