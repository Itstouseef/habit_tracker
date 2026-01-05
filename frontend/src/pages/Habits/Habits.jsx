import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, addHabit, updateHabit, deleteHabit } from "../../redux/habitSlice";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "./Habits.css";

const Habits = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habits.list);

  const [habitName, setHabitName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    if (editId) {
      dispatch(updateHabit({ id: editId, name: habitName }));
      setEditId(null);
    } else {
      dispatch(addHabit(habitName));
    }

    setHabitName("");
  };

  const handleEdit = (habit) => {
    setHabitName(habit.name);
    setEditId(habit.id);
  };

  const handleDelete = (id) => {
    dispatch(deleteHabit(id));
  };

  return (
    <div className="habits-page">
      <div className="habits-left-panel">
        <form onSubmit={handleAddOrUpdate} className="habit-form">
          <h3>{editId ? "Edit Habit" : "Add New Habit"}</h3>
          <input
            type="text"
            placeholder="Habit name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            required
          />
          <button type="submit">{editId ? "Update" : "Add"}</button>
        </form>
      </div>

      <div className="habits-right-panel">
        <h3>All Habits</h3>
        {habits.length === 0 ? (
          <p className="no-habits">No habits yet.</p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <span>{habit.name}</span>
              <div className="habit-actions">
                <button onClick={() => handleEdit(habit)} title="Edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(habit.id)} title="Delete">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Habits;
