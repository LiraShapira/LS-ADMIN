export interface UserData {
  userCount: number;
  newUserCount: number;
  transactionsPerUser: number[];
  averageTransactionsPerUser: number;
  depositsPerUser: number[];
  period: number;
  balanceCounts: any;
}

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  role: "BASIC" | "ADMIN",
  createdAt: string,
  accountBalance: string,
  email?: string,
  phoneNumber: string,
  adminCompostStandId: number,
}
