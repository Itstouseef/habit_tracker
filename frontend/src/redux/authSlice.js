import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// --- Thunks ---

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");
    try {
      const res = await api.get("/me");
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) clearAuthData();
      return rejectWithValue(err.response?.data || "Session expired");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/signup", userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/logout");
      clearAuthData();
      return true;
    } catch (error) {
      clearAuthData();
      return rejectWithValue("Logout failed");
    }
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    token: savedToken,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })

      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;

// --- Selectors ---
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
