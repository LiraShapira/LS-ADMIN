import { AttendeeRole, LSEvent } from "../types/EventTypes";
import { Category, Transaction } from "../types/TransactionTypes";
import { User, UserRole } from "../types/UserTypes";

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

// Get the date one month from today
const futureDate = new Date();
futureDate.setMonth(today.getMonth() + 1);

const futureDatePlusOneHour = new Date();
futureDatePlusOneHour.setMonth(today.getMonth() + 1);
futureDatePlusOneHour.setHours(today.getHours() + 1);

const futureDatePlusOneDay = new Date();
futureDatePlusOneDay.setMonth(today.getMonth() + 1);
futureDatePlusOneDay.setDate(today.getDate() + 1);


export const mockTransaction: Transaction = {
  recipientId: '1234355',
  purchaserId: '1234',
  category: Category.GROCERIES,
  amount: 10,
  createdAt: new Date('2023-07-05').toDateString(),
  reason: 'bought a spade',
  id: '123456',
  isRequest: false,
  users: [{ firstName: 'Bill', lastName: 'Withers' }]
}

export const mockTransaction2: Transaction = {
  recipientId: '1234',
  purchaserId: '1234355',
  category: Category.GARDEN,
  amount: 14,
  createdAt: new Date('2023-07-06').toDateString(),
  reason: 'bought seeds',
  id: '1234567',
  isRequest: false,
  users: [{ firstName: 'Bill', lastName: 'Withers' }]
}

export const mockTransaction3: Transaction = {
  recipientId: '1234',
  purchaserId: '1234355',
  category: Category.GROCERIES,
  amount: 100,
  createdAt: new Date('2023-07-08').toDateString(),
  reason: 'בקשה ממירון גלברד',
  id: '12345678',
  isRequest: false,
  users: [{ firstName: 'Bill', lastName: 'Withers' }]
}

export const mockUser: User = {
  firstName: 'Simon',
  lastName: 'Test',
  id: '1234',
  accountBalance: '154',
  createdAt: new Date('2023-07-05').toDateString(),
  transactions: [mockTransaction, mockTransaction2, mockTransaction3],
  phoneNumber: '123456789',
  role: UserRole.ADMIN,
  adminCompostStandId: null
}

export const mockUser2: User = {
  firstName: 'Bill',
  lastName: 'Withers',
  id: '1234355',
  accountBalance: '200',
  createdAt: new Date('2023-07-05').toDateString(),
  transactions: [mockTransaction, mockTransaction2, mockTransaction3],
  phoneNumber: '987654321',
  role: UserRole.BASIC,
  adminCompostStandId: null
}


export const mockEvent1: LSEvent = {
  id: '239rifjv23rfn',
  startDate: today.toISOString(),
  endDate: tomorrow.toISOString(),
  title: 'Example LS Event',
  description: 'An example event as a placeholder ',
  attendees: [{
    role: AttendeeRole.seller,
    user: mockUser,
    productsForSale: ['granola', 'תכשיטים']
  },
  {
    role: AttendeeRole.seller,
    user: mockUser2,
    productsForSale: ['hats']
  }],
  location: {
    id: "123-v4-v23r-nu65rdv-2eys"
  }
}

export const mockEvent2: LSEvent = {
  id: 'ju930rotjgma23r-08ijm',
  startDate: futureDate.toISOString(),
  endDate: futureDatePlusOneHour.toISOString(),
  title: 'shabbat singalong',
  description: 'An example event for demonstration purposes',
  attendees: [
    {
      role: AttendeeRole.seller,
      user: mockUser,
      productsForSale: ['granola']
    }
  ],
  location: {
    id: '234-ujhgr32-5tgbhju7-fdcdfr4'
  }
}
