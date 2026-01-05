import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; 

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/admin/users"); 
      return Array.isArray(response.data) ? response.data : response.data.users || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  "adminUsers/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data.user || response.data; // Matches backend
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(user => user.id === action.payload.id);
        if(index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminErrors } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
