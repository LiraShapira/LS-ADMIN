import { Transaction } from "./TransactionTypes";

export enum UserRole {
  ADMIN = 'admin',
  BASIC = 'basic'
}

export interface UserData {
  userCount: number;
  newUserCount: number;
  transactionsPerUser: number[];
  averageTransactionsPerUser: number;
  depositsPerUser: number[];
  period: number;
  balanceCounts: any
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
