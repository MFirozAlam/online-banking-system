package com.bankingsystem.controller;

import com.bankingsystem.dto.DepositRequest;
import com.bankingsystem.dto.TransactionDto;
import com.bankingsystem.dto.TransferRequest;
import com.bankingsystem.dto.WithdrawRequest;
import com.bankingsystem.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionDto> deposit(
            @RequestBody DepositRequest request) {

        TransactionDto transaction =
                transactionService.deposit(
                        request.getAccountId(),
                        request.getAmount().doubleValue()
                );

        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDto> withdraw(
            @RequestBody WithdrawRequest request) {

        TransactionDto transaction =
                transactionService.withdraw(
                        request.getAccountId(),
                        request.getAmount().doubleValue()
                );

        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDto> transfer(
            @RequestBody TransferRequest request) {

        TransactionDto transaction =
                transactionService.transfer(
                        request.getSenderAccountId(),
                        request.getReceiverAccountId(),
                        request.getAmount().doubleValue()
                );

        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDto>> getAccountTransactions(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                transactionService.getTransactionsByAccount(accountId)
        );
    }

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }
}