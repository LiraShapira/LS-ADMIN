import { User } from "./UserTypes";

export enum Category {
  GROCERIES = 'GROCERIES',
  GARDEN = 'GARDEN',
  MISC = 'MISC',
  GIFT = 'GIFT',
  DEPOSIT = 'DEPOSIT',
}

export interface Transaction {
  id: string;
  recipientId: string;
  purchaserId: string;
  category: Category;
  amount: number;
  createdAt: string;
  reason: string;
  isRequest: boolean;
  users: [
    User, User
  ]
}
