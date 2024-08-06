import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import eventsSlice from './eventsSlice';
import appSlice from './appSlice';
import transactionsSlice from './transactionsSlice';

export const store = configureStore({
  reducer: {
    eventState: eventsSlice,
    appState: appSlice,
    transactionState: transactionsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
