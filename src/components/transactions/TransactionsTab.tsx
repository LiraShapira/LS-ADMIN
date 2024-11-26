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
} from '../../store/transactionsSlice';
import TransactionList from './TransactionsList';

const TransactionsTab = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const [period, setPeriod] = useState(30);
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
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionsTab;
