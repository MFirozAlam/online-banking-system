package com.bankingsystem.service;

import com.bankingsystem.dto.TransactionDto;

import java.util.List;

public interface TransactionService {

    TransactionDto deposit(Long accountId, double amount);

    TransactionDto withdraw(Long accountId, double amount);

    TransactionDto transfer(Long senderAccountId, Long receiverAccountId, double amount);

    List<TransactionDto> getTransactionsByAccount(Long accountId);

    List<TransactionDto> getAllTransactions();
}