import { Transaction } from "./TransactionTypes";

export enum UserRole {
  ADMIN = 'admin',
  BASIC = 'basic'
}

export interface BalanceCount {
  balance: number;
  count: number;
}

export interface UserDataDTO {
  averageTransactionsPerUser: number;
  balanceCounts: BalanceCount[];
  depositsPerUser: number[];
  newUserCount: number;
  period: number;
  totalCoins: number;
  transactionsPerUser: number[];
  userCount: number;
}

export interface UserData extends UserDataDTO {
  numberOfDeposits: number;
  numberOfTransactions: number;
  averageNumberOfDepositsPerUser: number;
}

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  createdAt: string,
  accountBalance: string,
  email?: string,
  phoneNumber: string,
  transactions: Transaction[];
  adminCompostStandId: number | null;
}
