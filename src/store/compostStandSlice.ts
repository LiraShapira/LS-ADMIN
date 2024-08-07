import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { CompostStand } from '../types/CompostStandTypes';
import { SuccessApiResponse } from '../types/ApiTypes';
import { fetchCompostReportData } from '../apiServices/CompostStandAPI';

interface CompostStandsState {
  standsWithReports: CompostStand[]
}

const initialState: CompostStandsState = {
  standsWithReports: []
};

export const loadReportStats = createAsyncThunk<
  SuccessApiResponse<{ reports: CompostStand[] }>,
  { period: number },
  { state: RootState }
>('compostStands/loadReportStats', async ({ period }) => {
  const response = await fetchCompostReportData({ period });
  if (!('data' in response)) {
    throw new Error(response.message)
  }
  return response;
}
);

const appSlice = createSlice({
  name: 'compostStands',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(loadReportStats.fulfilled, (state, action) => {
      state.standsWithReports = action.payload.data.reports;
    })
  }
});

export const selectReports = (state: RootState) => state.compostStandsState.standsWithReports;

export default appSlice.reducer;
