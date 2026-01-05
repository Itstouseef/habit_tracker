// src/redux/journalSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// --- Thunks ---

// Fetch all journal entries
export const fetchJournals = createAsyncThunk(
  "journal/fetchJournals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/journals");
      return response.data; // array of journals
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add a new journal entry
export const addJournalAsync = createAsyncThunk(
  "journal/addJournal",
  async (journal, { rejectWithValue }) => {
    try {
      const response = await api.post("/journals", journal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update a journal entry
export const updateJournalAsync = createAsyncThunk(
  "journal/updateJournal",
  async (journal, { rejectWithValue }) => {
    try {
      const response = await api.put(`/journals/${journal.id}`, journal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a journal entry
export const deleteJournalAsync = createAsyncThunk(
  "journal/deleteJournal",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/journals/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- Slice ---

const journalSlice = createSlice({
  name: "journal",
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
      // Fetch
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addJournalAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJournalAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addJournalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateJournalAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournalAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateJournalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteJournalAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((j) => j.id !== action.payload);
      })
      .addCase(deleteJournalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = journalSlice.actions;
export default journalSlice.reducer;
