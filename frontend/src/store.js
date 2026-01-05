import { configureStore } from '@reduxjs/toolkit';
import goalsReducer from './redux/goalsSlice';
import journalReducer from './redux/journalSlice';
import habitsReducer from './redux/habitSlice';
import habitCompletionsReducer from './redux/habitCompletionSlice';
import adminUsersReducer from './redux/adminUsersSlice';
import authReducer from "./redux/authSlice";

const store = configureStore({
  reducer: {
    goals: goalsReducer,
    journal: journalReducer,
    habits: habitsReducer,                 // NEW
    habitCompletions: habitCompletionsReducer,
    adminUsers: adminUsersReducer,// NEW
    auth: authReducer,
    adminUsers: adminUsersReducer,
  },
});

export default store;
