// src/redux/habitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- Thunks ---

// Fetch all habits for the logged-in user
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/habits");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch habits");
    }
  }
);

// Add a new habit
export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (name, thunkAPI) => {
    try {
      const res = await api.post("/habits", { name });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add habit");
    }
  }
);

// Update an existing habit
export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async ({ id, name }, thunkAPI) => {
    try {
      const res = await api.put(`/habits/${id}`, { name });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update habit");
    }
  }
);

// Delete a habit
export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/habits/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete habit");
    }
  }
);

// --- Slice ---

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch habits
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add habit
      .addCase(addHabit.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update habit
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.list.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete habit
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.list = state.list.filter((h) => h.id !== action.payload);
      });
  },
});

export const { clearError } = habitsSlice.actions;
export default habitsSlice.reducer;
