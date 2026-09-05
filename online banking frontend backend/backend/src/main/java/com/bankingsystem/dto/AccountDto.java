package com.bankingsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    private Long id;
    private String accountHolderName;
    private String accountType;
    private double balance;
}
