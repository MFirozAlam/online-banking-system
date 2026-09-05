export interface UserDto {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface BankAccount {
  id: number;
  accountHolderName: string;
  balance: number;
  accountType?: string;
}

export interface DepositRequest {
  accountId: number;
  amount: number;
}

export interface WithdrawRequest {
  accountId: number;
  amount: number;
}

export interface TransferRequest {
  senderAccountId: number;
  receiverAccountId: number;
  amount: number;
}

export interface TransactionDto {
  id: number;
  accountId: number;
  receiverAccountId: number | null;
  type: string;
  amount: number;
  transactionDate: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'create'
  | 'getAccount'
  | 'deposit'
  | 'withdraw'
  | 'transfer'
  | 'transactions'
  | 'delete';