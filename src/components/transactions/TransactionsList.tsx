import { useState } from 'react';
import { Transaction } from '../../types/TransactionTypes';
import { User } from '../../types/UserTypes';
import EditTransactionModal from './EditTransactionModal';

interface TransactionListProps {
  transactions: Transaction[];
  showOnlyReceiver?: boolean;
  reverseSort?: boolean;
  onEdit?: (id: string, amount: number, reason?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const TransactionList = ({ 
  transactions, 
  showOnlyReceiver = false, 
  reverseSort = false,
  onEdit,
  onDelete
}: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Sort transactions by date (oldest to newest by default, or newest to oldest if reverseSort is true)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return reverseSort ? dateB - dateA : dateA - dateB;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEditSave = async (id: string, amount: number, reason?: string) => {
    if (onEdit) {
      await onEdit(id, amount, reason);
    }
  };

  return (
    <div>
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleEditSave}
        />
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
            {!showOnlyReceiver && (
              <>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>From</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>To</th>
              </>
            )}
            {showOnlyReceiver && (
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Receiver</th>
            )}
            {(onEdit || onDelete) && (
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((t) => {
            const users = t.users || [];
            const purchaser: User | undefined = users.find((u: User) => u.id === t.purchaserId);
            const recipient: User | undefined = users.find((u: User) => u.id === t.recipientId);
            // Swapped: From shows purchaser (sender), To shows recipient (receiver)
            const fromLabel = purchaser ? `${purchaser.firstName} ${purchaser.lastName}` : t.purchaserId;
            const toLabel = recipient ? `${recipient.firstName} ${recipient.lastName}` : t.recipientId;
            const handleDelete = async () => {
              if (window.confirm('Are you sure you want to delete this transaction? This will reverse the balance changes.')) {
                if (onDelete) {
                  setDeletingId(t.id);
                  try {
                    await onDelete(t.id);
                  } catch (error) {
                    console.error('Error deleting transaction:', error);
                  } finally {
                    setDeletingId(null);
                  }
                }
              }
            };

            return (
              <tr key={t.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatDate(t.createdAt)}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{t.amount}</td>
                {!showOnlyReceiver && (
                  <>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{fromLabel}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{toLabel}</td>
                  </>
                )}
                {showOnlyReceiver && (
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{toLabel}</td>
                )}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {onEdit && (
                        <button 
                          onClick={() => setEditingTransaction(t)}
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={handleDelete}
                          disabled={deletingId === t.id}
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '12px',
                            backgroundColor: deletingId === t.id ? '#ccc' : '#f44336',
                            color: 'white',
                            border: 'none',
                            cursor: deletingId === t.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deletingId === t.id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
