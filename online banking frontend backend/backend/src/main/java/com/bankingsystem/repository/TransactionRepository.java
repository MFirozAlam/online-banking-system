package com.bankingsystem.repository;

import com.bankingsystem.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    List<Transaction> findByTypeOrderByTransactionDateDesc(String type);

    @Modifying
    @Query("delete from Transaction t where t.account.id = :accountId")
    void deleteByAccountId(@Param("accountId") Long accountId);

    @Modifying
    @Query("delete from Transaction t where t.receiverAccount.id = :accountId")
    void deleteByReceiverAccountId(@Param("accountId") Long accountId);
}
