import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { fetchHabits } from "../../redux/habitSlice";
import { fetchCompletions } from "../../redux/habitCompletionSlice";
import { fetchJournals } from "../../redux/journalSlice";

import "./Calendars.css";

const Calendars = () => {
  const dispatch = useDispatch();

  // Redux states
  const habits = useSelector((state) => state.habits.list || []);
  const completions = useSelector(
    (state) => state.habitCompletions.byDate || {}
  );
  const journals = useSelector((state) => state.journal.list || []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  // -------------------------
  // Utility Functions
  // -------------------------
  const formatDate = (date) => date.toISOString().split("T")[0];

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  // -------------------------
  // Fetch Data
  // -------------------------
  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchCompletions());
    dispatch(fetchJournals());
  }, [dispatch]);

  // -------------------------
  // Calendar Tile Coloring
  // -------------------------
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    if (!habits.length) return "";

    const completed = habits.every((habit) =>
      Object.keys(completions).some(
        (key) => completions[key][habit.id] && isSameDay(new Date(key), date)
      )
    );

    const partial =
      habits.some((habit) =>
        Object.keys(completions).some(
          (key) => completions[key][habit.id] && isSameDay(new Date(key), date)
        )
      ) && !completed;

    if (completed) return "calendar-completed";
    if (partial) return "calendar-partial";
    return "calendar-missed";
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowDetails(true);
  };

  // -------------------------
  // Journal & Habit Data for Selected Date
  // -------------------------
  const habitsForDay = useMemo(
    () =>
      habits.map((habit) => {
        const done = Object.keys(completions).some(
          (key) =>
            completions[key][habit.id] && isSameDay(new Date(key), selectedDate)
        );
        return { ...habit, done };
      }),
    [habits, completions, selectedDate]
  );

  const journalsForDay = useMemo(
    () => journals.filter((j) => isSameDay(new Date(j.date), selectedDate)),
    [journals, selectedDate]
  );

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="calendar-page-container">
      <h1>Calendar</h1>

      <ReactCalendar
        value={selectedDate}
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
      />

      {showDetails && (
        <div
          className="day-details-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div className="day-details" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedDate.toDateString()}</h3>

            <section>
              <h4>Habits</h4>
              {habitsForDay.length === 0 && <p>No habits.</p>}
              {habitsForDay.map((h) => (
                <p
                  key={h.id}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {h.done ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#22c55e"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="6"
                        y1="18"
                        x2="18"
                        y2="6"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {h.name}
                </p>
              ))}
            </section>

            <section>
              <h4>Journal</h4>
              {journalsForDay.length === 0 && <p>No journal entries.</p>}
              {journalsForDay.map((j) => (
                <p key={j.id}>{j.entry}</p>
              ))}
            </section>

            <button onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <span className="legend completed"></span> All Done
        <span className="legend partial"></span> Partially Done
        <span className="legend missed"></span> Missed
      </div>
    </div>
  );
};

export default Calendars;
