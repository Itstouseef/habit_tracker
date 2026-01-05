// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchHabits } from "../../redux/habitSlice";
import { fetchCompletions } from "../../redux/habitCompletionSlice";
import { fetchGoals } from "../../redux/goalsSlice";
import { fetchJournals } from "../../redux/journalSlice";

import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const habits = useSelector((state) => state.habits.list);
  const completions = useSelector((state) => state.habitCompletions.byDate);
  const goals = useSelector((state) => state.goals.list);
  const journals = useSelector((state) => state.journal.list);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchCompletions(today));
    dispatch(fetchGoals());
    dispatch(fetchJournals());
  }, [dispatch, today]);

  /* ---------------- Stats ---------------- */

  const totalHabits = habits.length;
  const completedToday = habits.filter(
    (h) => completions[today]?.[h.id]
  ).length;

  // Proper streak calculation (all habits completed per day)
  const dates = Object.keys(completions).sort().reverse();
  let currentStreak = 0;

  for (let date of dates) {
    const allCompleted =
      habits.length > 0 &&
      habits.every((h) => completions[date]?.[h.id]);

    if (allCompleted) currentStreak++;
    else break;
  }

  const goalsCompleted = goals.filter((g) => g.completed).length;
  const recentJournal = journals.find((j) => {
  // Check if either 'date' or 'created_at' exists and contains today's date string
  const targetDate = j.date || j.created_at;
  return targetDate && targetDate.includes(today);
});

  /* ---------------- UI ---------------- */

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Today Summary */}
      <section className="dashboard-today-summary">
        <h3>Today</h3>
        <p>
          {completedToday} / {totalHabits} habits completed
        </p>
        <button onClick={() => navigate("/today")}>
          Go to Today
        </button>
      </section>

      {/* Quick Stats */}
      <section className="quick-stats-section">
        <div className="quick-stat-card">
          <h4>Current Streak</h4>
          <p>{currentStreak} days 🔥</p>
        </div>

        <div className="quick-stat-card">
          <h4>Goals Completed</h4>
          <p>
            {goalsCompleted} / {goals.length}
          </p>
        </div>

        <div className="quick-stat-card">
          <h4>Journal Today</h4>
          <p>{recentJournal ? "Yes" : "No"}</p>
        </div>
      </section>

      {/* Top Goals */}
      <section className="top-goals-section">
        <h3>Top Goals</h3>

        {goals.length === 0 ? (
          <p className="no-goals">No active goals</p>
        ) : (
          goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="goal-card">
              <h4>{goal.title}</h4>
              <div className="goal-progress">
                <div
                  className="progress-fill"
                  style={{ width: `${goal.progress || 0}%` }}
                />
              </div>
            </div>
          ))
        )}
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <button onClick={() => navigate("/habits")}>Manage Habits</button>
        <button onClick={() => navigate("/goals")}>View Goals</button>
        <button onClick={() => navigate("/journal")}>Journal</button>
        <button onClick={() => navigate("/insights")}>Insights</button>
      </section>
    </div>
  );
};

export default Dashboard;
