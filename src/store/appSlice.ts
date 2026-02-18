import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface AppState {
  loading: boolean;
  isModalVisible: boolean;
  modalText: string;
  selectedCommunityId: string;
}

const initialState: AppState = {
  isModalVisible: false,
  loading: false,
  modalText: '',
  selectedCommunityId: '',
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
    },
    setSelectedCommunityId: (state, action: PayloadAction<string>) => {
      state.selectedCommunityId = action.payload;
    },
  },
});

export const selectIsModalVisible = (state: RootState) => state.appState.isModalVisible;
export const selectModalText = (state: RootState) => state.appState.modalText;
export const selectIsAppLoading = (state: RootState) => state.appState.loading;
export const selectSelectedCommunityId = (state: RootState) => state.appState.selectedCommunityId;
export const { setIsModalVisible, setModalText, setLoading, setSelectedCommunityId } = appSlice.actions;

export default appSlice.reducer;
