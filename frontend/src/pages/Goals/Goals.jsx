import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";

import {
  fetchGoals,
  addGoalAsync,
  
  updateGoalAsync,
  deleteGoalAsync,
} from "../../redux/goalsSlice";
import "./Goals.css";

// --------------------
// Helper function: convert user input to milliseconds
// --------------------
const convertToMs = (value, unit) => {
  const val = Number(value);
  switch (unit) {
    case "minutes":
      return val * 60 * 1000;
    case "hours":
      return val * 60 * 60 * 1000;
    case "days":
      return val * 24 * 60 * 60 * 1000;
    case "weeks":
      return val * 7 * 24 * 60 * 60 * 1000;
    case "months":
      return val * 30 * 24 * 60 * 60 * 1000;
    default:
      return val * 60 * 1000;
  }
};

// --------------------
// Helper function: format ms to human-readable string
// --------------------
const formatTimeLeft = (ms) => {
  if (ms <= 0) return "Expired";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

// --------------------
// Main Goals Component
// --------------------
const Goals = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.goals);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalDurationValue, setNewGoalDurationValue] = useState("");
  const [newGoalDurationUnit, setNewGoalDurationUnit] = useState("minutes");

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalDescription || !newGoalDurationValue) return;

    await dispatch(
      addGoalAsync({
        title: newGoalTitle,
        description: newGoalDescription,
        completed: false,
        duration_ms: convertToMs(newGoalDurationValue, newGoalDurationUnit),
        started_at: new Date().toISOString(),
      })
    );

    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalDurationValue("");
    setNewGoalDurationUnit("minutes");
  };

  const handleToggleComplete = (goal) => {
  // 1. Create the updated object first
  const updatedGoal = { ...goal, completed: !goal.completed };

  // 2. ONLY dispatch the Async Thunk. 
  // Redux Toolkit handles the "loading" and "fulfilled" states 
  // so you don't need to manually toggle it twice.
 dispatch(updateGoalAsync({ ...goal, completed: !goal.completed }));
};

  const handleDelete = (id) => {
    dispatch(deleteGoalAsync(id));
  };

  // Progress calculation
  const totalGoals = list.length;
  const completedGoals = list.filter((g) => g.completed).length;
  const progressPercent =
    totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error}</p>;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="goals-page goals-layout">
      <div className="left-panel">
        {/* Progress Circle */}
        {/* Responsive Progress Circle */}
        <div className="progress-circle-container">
          <svg viewBox="0 0 200 200" className="progress-circle-svg">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              className="progress-bg"
              strokeWidth="15"
            />
            {/* Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={
                progressPercent < 30
                  ? "#ef4444"
                  : progressPercent < 50
                  ? "#f59e0b"
                  : progressPercent < 75
                  ? "#fbbf24"
                  : "#22c55e"
              }
              strokeWidth="15"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="none"
              className="progress-fill"
            />
          </svg>
          <div className="progress-text">
            <span>{progressPercent}%</span>
            <small>Progress</small>
          </div>
          <p className="summary">
            {completedGoals} of {totalGoals} goals completed
          </p>
        </div>

      

        {/* Add Goal Form */}
        <form onSubmit={handleAddGoal} className="add-goal-form">
          <h3 className="form-title">Add a New Goal</h3>

          <input
            type="text"
            placeholder="Goal Title"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            required
          />

          <TextareaAutosize
            minRows={3}
            placeholder="Goal Description"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            required
            className="goal-textarea"
          />

          <div className="goal-duration">
            <input
              type="number"
              min="1"
              placeholder="Duration"
              value={newGoalDurationValue}
              onChange={(e) => setNewGoalDurationValue(e.target.value)}
              required
            />
            <select
              value={newGoalDurationUnit}
              onChange={(e) => setNewGoalDurationUnit(e.target.value)}
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>

          <button type="submit">Add Goal</button>
        </form>
      </div>

      <div className="right-panel">
        <div className="goals-list">
          {(list || []).map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              toggleComplete={() => handleToggleComplete(goal)}
              deleteGoal={() => handleDelete(goal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --------------------
// Goal Card Component with countdown

// --------------------
const GoalCard = ({ goal, toggleComplete, deleteGoal }) => {
  const startTime = goal.started_at
    ? new Date(goal.started_at).getTime()
    : null;

  const duration = goal.duration_ms || 0;

  const calculateTimeLeft = () => {
    if (!startTime || !duration) return 0; // If no start time or duration, return 0
    return Math.max(startTime + duration - Date.now(), 0); // Time left is the remaining time from now
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [goal.started_at, goal.duration_ms]);

  const formatTime = (ms) => {
    if (ms <= 0) return "Time's up!";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  console.log(goal.started_at, goal.duration_ms);

  return (
    <div className={`goal-card ${goal.completed ? "completed" : ""}`}>
      <h3>{goal.title}</h3>
      <p>{goal.description || "No description"}</p>
      <p className="goal-time-left">⏱ {formatTime(timeLeft)}</p>

      <div className="goal-card-buttons">
        <button
          onClick={toggleComplete}
          className={`completed-toggle-btn ${
            goal.completed ? "completed" : ""
          }`}
          title={goal.completed ? "Mark Incomplete" : "Mark Complete"}
        >
          <FaCheckCircle />
        </button>

        <button
          onClick={deleteGoal}
          className="delete-icon-btn"
          title="Delete Goal"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default Goals;
