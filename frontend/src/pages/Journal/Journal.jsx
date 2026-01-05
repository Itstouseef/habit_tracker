import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import {
  FaTrashAlt,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { fetchHabits } from "../../redux/habitSlice";
import {
  fetchCompletions,
  updateCompletion,
} from "../../redux/habitCompletionSlice";
import {
  fetchJournals,
  addJournalAsync,
  updateJournalAsync,
  deleteJournalAsync,
} from "../../redux/journalSlice";

import "./Journal.css";

const Journal = () => {
  const dispatch = useDispatch();

  const habits = useSelector((state) => state.habits.list);
  const completions = useSelector((state) => state.habitCompletions.byDate);
  const journals = useSelector((state) => state.journal.list);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTitle, setNewTitle] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [editId, setEditId] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const normalizeDate = (date) => new Date(date).toISOString().split("T")[0];

  // Fetch data
  useEffect(() => {
    const dateStr = formatDate(selectedDate);
    dispatch(fetchHabits());
    dispatch(fetchCompletions(dateStr));
    dispatch(fetchJournals());
  }, [dispatch, selectedDate]);

  // ✅ FIXED toggle logic (Redux is the source of truth)
  const handleToggleHabit = (habitId) => {
    const dateStr = formatDate(selectedDate);

    const currentCompleted = completions?.[dateStr]?.[habitId] ?? false;

    const completed = !currentCompleted;

    dispatch(
      updateCompletion({
        habit_id: habitId,
        date: dateStr,
        completed,
      })
    );

    console.log("Habit toggled:", habitId, completed);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!newTitle || !newEntry) return;

    const dateStr = formatDate(selectedDate);

    if (editId) {
      dispatch(
        updateJournalAsync({
          id: editId,
          title: newTitle,
          entry: newEntry,
        })
      );
      setEditId(null);
    } else {
      dispatch(
        addJournalAsync({
          title: newTitle,
          entry: newEntry,
          date: dateStr,
        })
      );
    }

    setNewTitle("");
    setNewEntry("");
  };

  const handleEdit = (journal) => {
    setNewTitle(journal.title);
    setNewEntry(journal.entry);
    setEditId(journal.id);
  };

  const handleDelete = (id) => {
    dispatch(deleteJournalAsync(id));
  };

  const generateWeek = () => {
    const week = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      week.push(new Date(d));
    }
    return week;
  };

  const week = generateWeek();

  return (
    <div className="journal-page-container">
      {/* Calendar */}
      <div className="calendar-top">
        <button
          className="calendar-nav"
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate.setDate(selectedDate.getDate() - 1))
            )
          }
        >
          <FaChevronLeft />
        </button>

        <div className="calendar-week">
          {week.map((day) => {
            const dateStr = formatDate(day);
            const isToday = dateStr === formatDate(new Date());
            const isSelected = dateStr === formatDate(selectedDate);

            return (
              <div
                key={dateStr}
                className={`calendar-day ${isSelected ? "selected" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => setSelectedDate(new Date(day))}
              >
                <div className="day-name">
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
                <div className="day-number">{day.getDate()}</div>
              </div>
            );
          })}
        </div>

        <button
          className="calendar-nav"
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate.setDate(selectedDate.getDate() + 1))
            )
          }
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Main */}
      <div className="journal-page">
        {/* Left */}
        <div className="journal-left-panel">
          <form className="add-journal-form" onSubmit={handleAddOrUpdate}>
            <h3>{editId ? "Edit Journal Entry" : "Add a New Journal Entry"}</h3>

            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <TextareaAutosize
              minRows={4}
              placeholder="Write your journal..."
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              required
              className="journal-textarea"
            />

            <button type="submit">
              {editId ? "Update Entry" : "Add Entry"}
            </button>
          </form>

          {/* Habits */}
          <div className="habit-list">
  <h3>Habits</h3>
  {habits.length === 0 && <p>No habits yet.</p>}
  {habits.map((habit) => {
    const completed = completions[formatDate(selectedDate)]?.[habit.id] || false;

    return (
      <button
        key={habit.id}
        className={`habit-btn ${completed ? "checked" : ""}`}
        onClick={() => {
          console.log("Button clicked for habit:", habit.id);
          const dateStr = formatDate(selectedDate);
          const newCompleted = !completed;
          dispatch(updateCompletion({ habit_id: habit.id, date: dateStr, completed: newCompleted }));
        }}
      >
        <span>{habit.name}</span>
        {completed && <span>✓</span>}
      </button>
    );
  })}
</div>

        </div>

        {/* Right */}
        <div className="journal-right-panel">
          {!journals || journals.length === 0 ? (
            <p className="no-entries">No journal entries yet.</p>
          ) : (
            journals
              .filter((j) => normalizeDate(j.date) === formatDate(selectedDate))
              .map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  handleEdit={() => handleEdit(journal)}
                  handleDelete={() => handleDelete(journal.id)}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

const JournalCard = ({ journal, handleEdit, handleDelete }) => {
  const formattedDate = new Date(journal.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="journal-card">
      <div className="journal-header">
        <h4>{journal.title}</h4>
        <span className="journal-date">{formattedDate}</span>
      </div>

      <p className="journal-entry">{journal.entry}</p>

      <div className="journal-actions">
        <button onClick={handleEdit} title="Edit Entry">
          <FaEdit />
        </button>
        <button onClick={handleDelete} title="Delete Entry">
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default Journal;
