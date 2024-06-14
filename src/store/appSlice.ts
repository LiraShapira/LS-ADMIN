import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface EventsState {
  loading: boolean;
  isModalVisible: boolean,
}

const initialState: EventsState = {
  isModalVisible: false,
  loading: false
};


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isModalVisible = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const selectIsModalVisible = (state: RootState) => state.appState.isModalVisible;
export const { setIsModalVisible, setLoading } = appSlice.actions;

export default appSlice.reducer;
