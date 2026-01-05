// src/pages/Today/Today.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../../redux/habitSlice";
import {
  fetchCompletions,
  updateCompletion,
} from "../../redux/habitCompletionSlice";
import { fetchJournals, addJournalAsync } from "../../redux/journalSlice";

import "./Today.css";

const Today = () => {
  const dispatch = useDispatch();

  const habits = useSelector((state) => state.habits.list);
  const completions = useSelector((state) => state.habitCompletions.byDate);
  const journals = useSelector((state) => state.journal.list);

  const [newEntry, setNewEntry] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchCompletions(today));
    dispatch(fetchJournals());
  }, [dispatch, today]);

  const completedCount = habits.filter(
    (h) => completions[today]?.[h.id]
  ).length;

  const handleToggleHabit = (habitId) => {
    const completed = !completions[today]?.[habitId];
    dispatch(updateCompletion({ habit_id: habitId, date: today, completed }));
  };

  const handleAddJournal = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    await dispatch(
      addJournalAsync({
        entry: newEntry,
        date: today,
        title: "Today",
      })
    );

    setNewEntry("");
  };

  return (
    <div className="today-container">
      <h1>Today</h1>
      <p className="today-date">{today}</p>

      {/* Progress */}
      <p className="today-progress">
        {completedCount} / {habits.length} habits completed
      </p>

      {/* Habits */}
      <section className="today-habits">
        {habits.length === 0 && <p>No habits yet.</p>}

        {habits.map((habit) => (
          <label
            key={habit.id}
            className={`habit-item ${
              completions[today]?.[habit.id] ? "completed" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={!!completions[today]?.[habit.id]}
              onChange={() => handleToggleHabit(habit.id)}
            />
            {habit.name}
          </label>
        ))}
      </section>

      {/* Journal */}
      <section className="today-journal">
        <h3>Quick Journal</h3>

        <form onSubmit={handleAddJournal}>
          <textarea
            placeholder="How did today go?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>

        {journals
          .filter((j) => j.date === today)
          .map((journal) => (
            <div key={journal.id} className="journal-card">
              <p>{journal.entry}</p>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Today;
