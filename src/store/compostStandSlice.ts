import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { CompostStand } from '../types/CompostStandTypes';

interface CompostStandsState {
  standsWithReports: CompostStand[]
}

const initialState: CompostStandsState = {
  standsWithReports: []
};


const appSlice = createSlice({
  name: 'compostStands',
  initialState,
  reducers: {
  }
});

export const selectReports = (state: RootState) => state.compostStandsState.standsWithReports;

export default appSlice.reducer;
