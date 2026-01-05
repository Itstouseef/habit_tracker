// src/redux/goalsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- Async Thunks ---

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/goals");
      return res.data; // Already filtered by user on backend
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch goals");
    }
  }
);

export const addGoalAsync = createAsyncThunk(
  "goals/addGoalAsync",
  async (goal, thunkAPI) => {
    try {
      const res = await api.post("/goals", goal);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add goal");
    }
  }
);

export const updateGoalAsync = createAsyncThunk(
  "goals/updateGoalAsync",
  async (goal, thunkAPI) => {
    try {
      const res = await api.put(`/goals/${goal.id}`, goal);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update goal");
    }
  }
);

export const deleteGoalAsync = createAsyncThunk(
  "goals/deleteGoalAsync",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/goals/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete goal");
    }
  }
);

// --- Slice ---

const goalsSlice = createSlice({
  name: "goals",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGoals
      .addCase(fetchGoals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGoals.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchGoals.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // addGoalAsync
      .addCase(addGoalAsync.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addGoalAsync.rejected, (state, action) => { state.error = action.payload; })

      // updateGoalAsync
      .addCase(updateGoalAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateGoalAsync.rejected, (state, action) => { state.error = action.payload; })

      // deleteGoalAsync
      .addCase(deleteGoalAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((g) => g.id !== action.payload);
      })
      .addCase(deleteGoalAsync.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default goalsSlice.reducer;
