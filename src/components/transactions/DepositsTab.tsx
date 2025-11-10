import { useEffect, useState } from 'react';
import {
  setLoading,
  setModalText,
  setIsModalVisible,
} from '../../store/appSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  loadTransactionStats,
  selectTransactions,
  deleteTransaction,
  updateTransaction,
} from '../../store/transactionsSlice';
import TransactionList from './TransactionsList';
import { Category } from '../../types/TransactionTypes';

const DepositsTab = () => {
  const dispatch = useAppDispatch();
  const allTransactions = useAppSelector(selectTransactions);
  const [period, setPeriod] = useState(30);
  
  // Filter only DEPOSIT transactions
  const deposits = allTransactions.filter(
    (t) => t.category === Category.DEPOSIT
  );

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(loadTransactionStats({ period }))
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
  }, [dispatch, period]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: 5 }}>
      <div className={'DataDisplay'}>
        <h1>Deposits List</h1>
        <div>PERIOD: {period} days</div>
        <input
          style={{ width: '50px' }}
          defaultValue={30}
          type={'number'}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          min={0}
        />
        <div>Deposit count: {deposits.length}</div>
        <TransactionList 
          transactions={deposits} 
          showOnlyReceiver={true} 
          reverseSort={true}
          onEdit={async (id, amount, reason) => {
            try {
              dispatch(setLoading(true));
              await dispatch(updateTransaction({ id, amount, reason, period })).unwrap();
              await dispatch(loadTransactionStats({ period })).unwrap();
              dispatch(setLoading(false));
              dispatch(setModalText('Deposit updated successfully'));
              dispatch(setIsModalVisible(true));
            } catch (e: any) {
              dispatch(setModalText(e.message || 'Failed to update deposit'));
              dispatch(setIsModalVisible(true));
              dispatch(setLoading(false));
            }
          }}
          onDelete={async (id) => {
            try {
              dispatch(setLoading(true));
              await dispatch(deleteTransaction({ id, period })).unwrap();
              await dispatch(loadTransactionStats({ period })).unwrap();
              dispatch(setLoading(false));
              dispatch(setModalText('Deposit deleted successfully'));
              dispatch(setIsModalVisible(true));
            } catch (e: any) {
              dispatch(setModalText(e.message || 'Failed to delete deposit'));
              dispatch(setIsModalVisible(true));
              dispatch(setLoading(false));
            }
          }}
        />
      </div>
    </div>
  );
};

export default DepositsTab;

