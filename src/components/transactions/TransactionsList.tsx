import { Transaction } from '../../types/TransactionTypes';
import TransactionItem from './TransactionsItems';

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {transactions.map((t) => (
        <TransactionItem key={t.id} transaction={t} />
      ))}
    </div>
  );
};

export default TransactionList;
