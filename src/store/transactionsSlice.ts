import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Transaction } from '../types/TransactionTypes';
import { SuccessApiResponse } from '../types/ApiTypes';
import {
  fetchTransactionStats,
  LoadTransactionsReturn as LoadTransactionStatsReturn,
  deleteTransaction as deleteTransactionAPI,
  updateTransaction as updateTransactionAPI,
} from '../apiServices/TransactionAPI';

interface AppState {
  loading: boolean;
  transactions: Transaction[];
}

const initialState: AppState = {
  loading: false,
  transactions: [],
};

export const loadTransactionStats = createAsyncThunk<
  SuccessApiResponse<LoadTransactionStatsReturn>,
  { period: number },
  { state: RootState }
>('transactions/loadTransactionStats', async ({ period }) => {
  const response = await fetchTransactionStats({ period });
  if (!('data' in response)) {
    throw new Error(response.message);
  }
  return response;
});

export const deleteTransaction = createAsyncThunk<
  void,
  { id: string; period: number },
  { state: RootState }
>('transactions/deleteTransaction', async ({ id }) => {
  const response = await deleteTransactionAPI(id);
  if (!('data' in response)) {
    throw new Error(response.message);
  }
});

export const updateTransaction = createAsyncThunk<
  Transaction,
  { id: string; amount: number; reason?: string; period: number },
  { state: RootState }
>('transactions/updateTransaction', async ({ id, amount, reason }) => {
  const response = await updateTransactionAPI(id, amount, reason);
  if (!('data' in response)) {
    throw new Error(response.message);
  }
  return response.data;
});

const appSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTransactionStats.fulfilled, (state, action) => {
      const transactions = action?.payload?.data?.transactions || [];
      state.transactions = transactions;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      // Transaction deleted, will be refreshed by parent component
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      // Transaction updated, will be refreshed by parent component
    });
  },
});

export const selectTransactions = (state: RootState) =>
  state.transactionState.transactions;
export const selectIsAppLoading = (state: RootState) =>
  state.transactionState.loading;
export const { setLoading } = appSlice.actions;

export default appSlice.reducer;
