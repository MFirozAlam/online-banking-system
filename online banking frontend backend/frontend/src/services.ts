import type {
  UserDto,
  LoginRequest,
  RegisterRequest,
  BankAccount,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  TransactionDto,
} from './types';

const API_BASE_URL = 'http://localhost:8080/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {

    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data
        ? String((data as { message: unknown }).message)
        : typeof data === 'string'
          ? data
          : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}


/* =========================
   AUTH API
   ========================= */

export const authApi = {

  register: (data: RegisterRequest) =>
    request<UserDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginRequest) =>
    request<UserDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};


/* =========================
   ACCOUNT API
   ========================= */

export const accountApi = {

  getAll: () =>
    request<BankAccount[]>('/accounts'),

  getById: (id: number) =>
    request<BankAccount>(`/accounts/${id}`),

  create: (
    accountHolderName: string,
    accountType: string,
    balance: number
  ) =>
    request<BankAccount>('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        accountHolderName,
        accountType,
        balance,
      }),
    }),

  deposit: (
    id: number,
    amount: number
  ) =>
    request<BankAccount>(`/accounts/${id}/deposit`, {
      method: 'PUT',
      body: JSON.stringify({
        amount,
      }),
    }),

  withdraw: (
    id: number,
    amount: number
  ) =>
    request<BankAccount>(`/accounts/${id}/withdraw`, {
      method: 'PUT',
      body: JSON.stringify({
        amount,
      }),
    }),

  delete: (id: number) =>
    request<void>(`/accounts/${id}`, {
      method: 'DELETE',
    }),
};


/* =========================
   TRANSACTION API
   ========================= */

export const transactionApi = {

  deposit: (data: DepositRequest) =>
    request<TransactionDto>('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  withdraw: (data: WithdrawRequest) =>
    request<TransactionDto>('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  transfer: (data: TransferRequest) =>
    request<TransactionDto>('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByAccount: (accountId: number) =>
    request<TransactionDto[]>(
      `/transactions/account/${accountId}`
    ),

  getAll: () =>
    request<TransactionDto[]>('/transactions'),
};