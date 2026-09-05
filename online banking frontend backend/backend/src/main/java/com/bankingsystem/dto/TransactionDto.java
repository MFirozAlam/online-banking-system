package com.bankingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {

    private Long id;

    private Long accountId;

    private Long receiverAccountId;

    private String type;

    private BigDecimal amount;

    private LocalDateTime transactionDate;
}