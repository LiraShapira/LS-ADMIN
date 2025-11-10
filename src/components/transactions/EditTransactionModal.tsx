import { useState, useEffect } from 'react';
import { Transaction } from '../../types/TransactionTypes';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (id: string, amount: number, reason?: string) => Promise<void>;
}

const EditTransactionModal = ({ transaction, onClose, onSave }: EditTransactionModalProps) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setReason(transaction.reason || '');
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(transaction.id, parseFloat(amount), reason || undefined);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to update transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='overlay'>
      <div
        style={{
          borderColor: 'blue',
          borderWidth: 4,
          borderStyle: 'solid',
          width: '400px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          gap: '15px',
        }}
      >
        <h2>Edit Transaction</h2>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Reason (optional):</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={isSaving}>Cancel</button>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;

