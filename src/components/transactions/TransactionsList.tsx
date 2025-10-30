import { Transaction } from '../../types/TransactionTypes';
import { User } from '../../types/UserTypes';

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>From</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>To</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const users = t.users || [];
            const purchaser: User | undefined = users.find((u: User) => u.id === t.purchaserId);
            const recipient: User | undefined = users.find((u: User) => u.id === t.recipientId);
            const fromLabel = recipient ? `${recipient.firstName} ${recipient.lastName}` : t.recipientId;
            const toLabel = purchaser ? `${purchaser.firstName} ${purchaser.lastName}` : t.purchaserId;
            return (
              <tr key={t.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{t.amount}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{fromLabel}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{toLabel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
