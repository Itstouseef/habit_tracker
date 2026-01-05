// src/pages/Insights/Insights.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../../redux/habitSlice";
import { fetchCompletions } from "../../redux/habitCompletionSlice";
import { fetchGoals } from "../../redux/goalsSlice";
import { fetchJournals } from "../../redux/journalSlice";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./Insights.css";

const Insights = () => {
  const dispatch = useDispatch();

  const habits = useSelector((state) => state.habits.list);
  const completions = useSelector((state) => state.habitCompletions.byDate);
  const goals = useSelector((state) => state.goals.list);
  const journals = useSelector((state) => state.journal.list);

  const [dateRange, setDateRange] = useState(7); // Last 7 days

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchCompletions());
    dispatch(fetchGoals());
    dispatch(fetchJournals());
  }, [dispatch]);

  // -------------------------
  // Utility Functions
  // -------------------------

  const formatDate = (date) => date.toISOString().split("T")[0];

  // Get last `dateRange` days
  const lastNDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = dateRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(formatDate(d));
    }
    return dates;
  }, [dateRange]);

  // -------------------------
  // Habit Insights
  // -------------------------

  const habitCompletionStats = useMemo(() => {
    const stats = habits.map((habit) => {
      let total = 0;
      let streak = 0;
      let longestStreak = 0;
      let currentStreak = 0;

      lastNDates.forEach((date) => {
        const completed = completions[date]?.[habit.id] || false;
        total += completed ? 1 : 0;

        if (completed) {
          streak++;
          currentStreak = streak;
        } else {
          if (streak > longestStreak) longestStreak = streak;
          streak = 0;
        }
      });
      if (streak > longestStreak) longestStreak = streak;

      return {
        habit,
        completionRate: total / dateRange,
        currentStreak,
        longestStreak,
      };
    });
    return stats;
  }, [habits, completions, lastNDates, dateRange]);

  const habitHeatmapData = useMemo(() => {
    return habits.map((habit) => {
      const row = { name: habit.name };
      lastNDates.forEach((date) => {
        row[date] = completions[date]?.[habit.id] ? 1 : 0;
      });
      return row;
    });
  }, [dispatch, lastNDates, completions]);

  // -------------------------
  // Goal Insights
  // -------------------------
  const goalStats = useMemo(() => {
    const completedGoals = goals.filter((g) => g.completed).length;
    const inProgress = goals.filter((g) => !g.completed && g.title).length;
    const notStarted = goals.length - completedGoals - inProgress;

    return { completedGoals, inProgress, notStarted };
  }, [goals]);

  const goalPieData = [
    { name: "Completed", value: goalStats.completedGoals, color: "#4caf50" },
    { name: "In Progress", value: goalStats.inProgress, color: "#ff9800" },
    { name: "Not Started", value: goalStats.notStarted, color: "#f44336" },
  ];

  // -------------------------
  // Journal Insights
  // -------------------------
  const journalStats = useMemo(() => {
    const entriesPerDay = lastNDates.map((date, index) => {
      return {
        index: index + 1, // position index for XAxis
        date,
        count: journals.filter((j) => formatDate(new Date(j.date)) === date)
          .length,
      };
    });
    return entriesPerDay;
  }, [journals, lastNDates]);

  // -------------------------
  // Quick Stats
  // -------------------------
  const longestHabitStreak = useMemo(() => {
    if (habitCompletionStats.length === 0) return 0;
    return Math.max(...habitCompletionStats.map((h) => h.longestStreak));
  }, [habitCompletionStats]);

  const avgDailyHabits = useMemo(() => {
    if (habitCompletionStats.length === 0) return 0;
    const total = habitCompletionStats.reduce(
      (sum, h) => sum + h.completionRate,
      0
    );
    return ((total / habitCompletionStats.length) * habits.length).toFixed(1);
  }, [habitCompletionStats, habits.length]);

  const goalsCompletedThisWeek = useMemo(
    () => goalStats.completedGoals,
    [goalStats]
  );

  const journalEntriesThisWeek = useMemo(() => {
    return journals.filter((j) =>
      lastNDates.includes(formatDate(new Date(j.date)))
    ).length;
  }, [journals, lastNDates]);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="insights-page">
      <h1>Insights</h1>
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Longest Streak</h3>
          <p>{longestHabitStreak} days</p>
        </div>
        <div className="stat-card">
          <h3>Avg Daily Habits</h3>
          <p>
            {avgDailyHabits} / {habits.length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Goals Completed</h3>
          <p>
            {goalsCompletedThisWeek} / {goals.length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Journal Entries</h3>
          <p>{journalEntriesThisWeek}</p>
        </div>
      </div>
      {/* Period Selector */}
      <div className="habit-period-selector stat-card">
      
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            className={dateRange === days ? "active" : ""}
            onClick={() => setDateRange(days)}
          >
            Last {days} Days
          </button>
        ))}
      </div>

      <div className="insights-panels">
        {/* Habit Panel */}
        {/* Habit Panel */}
        {/* Habit Panel */}
        {/* Habit Panel */}
        {/* Habit Panel */}
        {/* Habit Panel */}
        <div className="panel habits-panel">
          <h2>Habits</h2>

          {/* Summary Stats */}
          <div className="habit-summary">
            <div className="summary-card">
              <h4>Total Habits</h4>
              <p>{habits.length}</p>
            </div>
            <div className="summary-card">
              <h4>Avg Completion</h4>
              <p>
                {(
                  (habitCompletionStats.reduce(
                    (sum, h) => sum + h.completionRate,
                    0
                  ) /
                    habitCompletionStats.length) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="summary-card">
              <h4>Longest Streak</h4>
              <p>
                {Math.max(
                  ...habitCompletionStats.map((h) => h.longestStreak),
                  0
                )}{" "}
                days
              </p>
            </div>
          </div>

          <h3>Habit Completion</h3>

          <div className="habit-bar-grid">
            {habitCompletionStats.map((h) => {
              const completionPercent = Math.round(h.completionRate * 100);

              return (
                <div key={h.habit.id} className="habit-bar-row">
                  <span className="habit-name">{h.habit.name}</span>

                  <div className="habit-bar-container">
                    <div
                      className="habit-bar-fill"
                      style={{ width: `${completionPercent}%` }}
                      title={`Completion: ${completionPercent}% | Current streak: ${h.currentStreak}`}
                    ></div>
                  </div>

                  <span className="habit-bar-label">{completionPercent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Panel */}
        <div className="panel">
          <h2>Goals</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={goalPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {goalPieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Journal Panel */}
        {/* Journal Panel */}
        <div className="panel">
          <h2>Journal Entries</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={journalStats}>
              <XAxis
                dataKey="index"
                tick={false} // hide ticks
                axisLine={false} // hide X axis line
                tickLine={false} // hide tick lines
              />
              <YAxis />
              <Tooltip content={<JournalTooltip />} />
              <Bar dataKey="count" fill="#5b7cfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
// Tooltip for Journal Entries
const JournalTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { date, count } = payload[0].payload;

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        fontSize: "12px",
      }}
    >
      <div style={{ fontWeight: 600 }}>{date}</div>
      <div>{count} entries</div>
    </div>
  );
};

export default Insights;
