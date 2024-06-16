import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface EventsState {
  loading: boolean;
  isModalVisible: boolean,
  modalText: string;

}

const initialState: EventsState = {
  isModalVisible: false,
  loading: false,
  modalText: ''
};


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isModalVisible = action.payload;
    },
    setModalText: (state, action: PayloadAction<string>) => {
      state.modalText = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const selectIsModalVisible = (state: RootState) => state.appState.isModalVisible;
export const selectModalText = (state: RootState) => state.appState.modalText;
export const selectIsLoading = (state: RootState) => state.appState.loading;
export const { setIsModalVisible, setModalText, setLoading } = appSlice.actions;

export default appSlice.reducer;
