import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
