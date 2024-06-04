import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import eventsSlice from './eventsSlice';

export const store = configureStore({
  reducer: {
    eventState: eventsSlice
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
