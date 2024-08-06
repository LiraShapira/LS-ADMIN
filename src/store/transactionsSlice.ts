import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Transaction } from '../types/TransactionTypes';
import { SuccessApiResponse } from '../types/ApiTypes';
import { fetchTransactionStats, LoadTransactionsReturn as LoadTransactionStatsReturn } from '../apiServices/TransactionAPI';

interface AppState {
  loading: boolean;
  transactions: Transaction[]
}

const initialState: AppState = {
  loading: false,
  transactions: []
};


export const loadTransactionStats = createAsyncThunk<
  SuccessApiResponse<LoadTransactionStatsReturn>,
  { period: number },
  { state: RootState }
>(
  'transactions/loadTransactionStats',
  async ({ period }) => {
    const response = await fetchTransactionStats({ period });
    if (!('data' in response)) {
      throw new Error(response.message)
    }
    return response;
  }
);


const appSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadTransactionStats.fulfilled, (state, action) => {
      state.transactions = action.payload.data.transactions;
    })
  }
});

export const selectTransactions = (state: RootState) => state.transactionState.transactions
export const selectIsAppLoading = (state: RootState) => state.transactionState.loading;
export const { setLoading } = appSlice.actions;

export default appSlice.reducer;
