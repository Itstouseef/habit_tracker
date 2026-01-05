// src/pages/Admin/User.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../redux/adminUsersSlice";
import "./User.css";

export default function User() {
  const dispatch = useDispatch();
  const { list: users = [], loading, error } = useSelector(state => state.adminUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    alert(`Edit user: ${user.name}`);
    // TODO: Open modal or navigate to edit page
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  return (
    <div className="users-page">
      <h2>Users Management</h2>

      {loading && <p className="loading">Loading users...</p>}
      {error && <p className="error">{typeof error === "string" ? error : error.message}</p>}

      {!loading && !error && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(user)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
