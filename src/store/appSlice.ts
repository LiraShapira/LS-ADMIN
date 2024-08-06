import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface AppState {
  loading: boolean;
  isModalVisible: boolean,
  modalText: string;

}

const initialState: AppState = {
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
export const selectIsAppLoading = (state: RootState) => state.appState.loading;
export const { setIsModalVisible, setModalText, setLoading } = appSlice.actions;

export default appSlice.reducer;
