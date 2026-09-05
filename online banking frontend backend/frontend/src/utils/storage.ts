import { UserDto } from '../types';

const USER_KEY = 'banking_user';

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });
}

export function saveUser(user: UserDto): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): UserDto | null {
  const data = localStorage.getItem(USER_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as UserDto;
  } catch {
    return null;
  }
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}