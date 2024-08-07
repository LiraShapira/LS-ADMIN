import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import eventsSlice from './eventsSlice';
import appSlice from './appSlice';
import transactionsSlice from './transactionsSlice';
import compostStandSlice from './compostStandSlice';

export const store = configureStore({
  reducer: {
    eventState: eventsSlice,
    appState: appSlice,
    transactionState: transactionsSlice,
    compostStandsState: compostStandSlice
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
