import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../services/api";
import { setUserId, getUserId, logout as logoutUtil } from "../../utils/auth";

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const users = await userApi.getByCredentials(username, password);
      if (users.length === 0) {
        return rejectWithValue('User not found');
      }
      
      const user = users[0];
      setUserId(user.id);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId || userId === 'temp') {
        return null;
      }
      return await userApi.getById(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAsGuest: (state) => {
      state.isGuest = true;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.status = 'idle';
      state.error = null;
      logoutUtil();
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isGuest = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isGuest = false;
        } else {
          state.isGuest = getUserId() === 'temp';
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const authActions = authSlice.actions;
export default authSlice; 