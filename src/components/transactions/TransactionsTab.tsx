import { useEffect, useState } from 'react';
import {
  setLoading,
  setModalText,
  setIsModalVisible,
} from '../../store/appSlice';
import { selectSelectedCommunityId } from '../../store/appSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  loadTransactionStats,
  selectTransactions,
  deleteTransaction,
  updateTransaction,
} from '../../store/transactionsSlice';
import TransactionList from './TransactionsList';
import { Category } from '../../types/TransactionTypes';

const TransactionsTab = () => {
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(selectSelectedCommunityId);
  const allTransactions = useAppSelector(selectTransactions);
  const [period, setPeriod] = useState(30);
  
  // Filter out DEPOSIT transactions (show only MISC and other types)
  const transactions = allTransactions.filter(
    (t) => t.category !== Category.DEPOSIT
  );

  useEffect(() => {
    if (!communityId) return;
    dispatch(setLoading(true));
    dispatch(loadTransactionStats({ period, communityId }))
      .unwrap()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        dispatch(setLoading(false));
        throw new Error(e);
      });
  }, [dispatch, period, communityId]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: 5 }}>
      <div className={'DataDisplay'}>
        <h1>Transactions List</h1>
        <div>PERIOD: {period} days</div>
        <input
          style={{ width: '50px' }}
          defaultValue={30}
          type={'number'}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          min={0}
        />
        <div>Transaction count: {transactions.length}</div>
        <TransactionList 
          transactions={transactions} 
          onEdit={async (id, amount, reason) => {
            try {
              dispatch(setLoading(true));
              await dispatch(updateTransaction({ id, amount, reason, period })).unwrap();
              await dispatch(loadTransactionStats({ period, communityId })).unwrap();
              dispatch(setLoading(false));
              dispatch(setModalText('Transaction updated successfully'));
              dispatch(setIsModalVisible(true));
            } catch (e: any) {
              dispatch(setModalText(e.message || 'Failed to update transaction'));
              dispatch(setIsModalVisible(true));
              dispatch(setLoading(false));
            }
          }}
          onDelete={async (id) => {
            try {
              dispatch(setLoading(true));
              await dispatch(deleteTransaction({ id, period })).unwrap();
              await dispatch(loadTransactionStats({ period, communityId })).unwrap();
              dispatch(setLoading(false));
              dispatch(setModalText('Transaction deleted successfully'));
              dispatch(setIsModalVisible(true));
            } catch (e: any) {
              dispatch(setModalText(e.message || 'Failed to delete transaction'));
              dispatch(setIsModalVisible(true));
              dispatch(setLoading(false));
            }
          }}
        />
      </div>
    </div>
  );
};

export default TransactionsTab;
