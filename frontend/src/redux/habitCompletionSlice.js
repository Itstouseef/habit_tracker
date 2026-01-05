// src/redux/habitCompletionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Central Axios instance

// --- Thunks ---

// Fetch completions for a specific date
export const fetchCompletions = createAsyncThunk(
  "habitCompletions/fetchCompletions",
  async (date, thunkAPI) => {
    try {
      const res = await api.get(`/habit-completions?date=${date}`);
      return { date, completions: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch completions"
      );
    }
  }
);

// Update completion (or create if it doesn't exist)
export const updateCompletion = createAsyncThunk(
  "habitCompletions/updateCompletion",
  async ({ habit_id, date, completed }, thunkAPI) => {
    try {
      await api.post("/habit-completions", { habit_id, date, completed });
      return { habit_id, date, completed };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update completion"
      );
    }
  }
);

// --- Slice ---

const habitCompletionsSlice = createSlice({
  name: "habitCompletions",
  initialState: {
    byDate: {}, // { "2026-01-01": { habitId: completed } }
    loading: false,
    error: null,
  },
  reducers: {
    // Clear error for UI notifications
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch completions
      .addCase(fetchCompletions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletions.fulfilled, (state, action) => {
        state.loading = false;
        const date = action.payload.date;
        if (!state.byDate[date]) state.byDate[date] = {};
        action.payload.completions.forEach((c) => {
          state.byDate[date][c.habit_id] = c.completed;
        });
      })
      .addCase(fetchCompletions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update completion
      .addCase(updateCompletion.fulfilled, (state, action) => {
        const { date, habit_id, completed } = action.payload;
        if (!state.byDate[date]) state.byDate[date] = {};
        state.byDate[date][habit_id] = completed;
      })
      .addCase(updateCompletion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = habitCompletionsSlice.actions;
export default habitCompletionsSlice.reducer;
