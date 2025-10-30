import { Transaction } from '../../types/TransactionTypes';
import { User } from '../../types/UserTypes';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const users = transaction.users || [];
  const purchaser: User | undefined = users.find((u: User) => u.id === transaction.purchaserId);
  const recipient: User | undefined = users.find((u: User) => u.id === transaction.recipientId);
  return (
    <div style={{ border: 'solid 1 black', borderWidth: 1 }}>
      <div>
        <div>{transaction.amount}</div>
        <div>
          from: {recipient ? `${recipient.firstName} ${recipient.lastName}` : transaction.recipientId}
        </div>
        <div>
          to: {purchaser ? `${purchaser.firstName} ${purchaser.lastName}` : transaction.purchaserId}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
