import { Transaction } from '../../types/TransactionTypes';
import { User } from '../../types/UserTypes';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const users = transaction.users;
  const recipientIndex = users.findIndex(
    (u: User) => u.id === transaction.recipientId
  );
  const purchaserIndex = recipientIndex === 0 ? 1 : 0;
  return (
    <div style={{ border: 'solid 1 black', borderWidth: 1 }}>
      <div>
        <div>{transaction.amount}</div>
        <div>
          from: {users[recipientIndex].firstName}{' '}
          {users[recipientIndex].lastName}
        </div>
        <div>
          to: {users[purchaserIndex].firstName} {users[purchaserIndex].lastName}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
