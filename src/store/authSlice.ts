import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

export interface Admin {
  id: string;
  email: string;
  communityId: string | null;
  isSuperAdmin: boolean;
}

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      localStorage.removeItem('adminId');
      localStorage.removeItem('admin');
    },
  },
});

export const { setAdmin, setLoading, logout } = authSlice.actions;
export const selectAdmin = (state: RootState) => state.authState.admin;
export const selectIsAuthenticated = (state: RootState) => state.authState.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.authState.isLoading;
export const selectIsSuperAdmin = (state: RootState) => state.authState.admin?.isSuperAdmin ?? false;

export default authSlice.reducer;
