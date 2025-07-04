import { UserData, UserDataDTO } from "../types/UserTypes";

export const convertUserData = (userData: UserDataDTO): UserData => {
    const numberOfDeposits = userData.depositsPerUser.length
    const numberOfTransactions = userData.transactionsPerUser.length;
    const averageNumberOfDepositsPerUser = userData.depositsPerUser.reduce((acc, curr) => acc + curr, 0) / userData.userCount || 0;

    return {
        userCount: userData.userCount,
        newUserCount: userData.newUserCount,
        transactionsPerUser: userData.transactionsPerUser,
        averageTransactionsPerUser: userData.averageTransactionsPerUser,
        depositsPerUser: userData.depositsPerUser,
        period: userData.period,
        totalCoins: userData.totalCoins,
        balanceCounts: userData.balanceCounts,
        numberOfDeposits: numberOfDeposits,
        numberOfTransactions: numberOfTransactions,
        averageNumberOfDepositsPerUser: averageNumberOfDepositsPerUser,

    };
}