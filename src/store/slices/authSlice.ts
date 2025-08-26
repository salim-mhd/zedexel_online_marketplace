// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 🔹 Register API thunk
export const registerUser = createAsyncThunk<
  AuthResponse, // ✅ resolved type
  { username: string; email: string; password: string }, // ✅ argument type
  { rejectValue: string } // ✅ reject type
>("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await axios.post<AuthResponse>("/api/auth/register", userData);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Register failed"
    );
  }
});

// 🔹 Login API thunk
export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    const res = await axios.post<AuthResponse>("/api/auth/login", credentials);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Register failed";
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
