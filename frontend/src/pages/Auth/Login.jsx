import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { Navigate, Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  if (user) {
    return user.role.toLowerCase() === "admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/dashboard" />
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-split-container">
        <div className="auth-left">
          <div className="auth-illustration">
            <h2>Track Your Habits Daily</h2>
            <p>Check, improve, and celebrate your streaks! </p>
            
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-page">
            <h2>Login</h2>
            <p className="auth-motivation">Let’s keep building your habits today </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              {error?.errors &&
                Object.values(error.errors)
                  .flat()
                  .map((msg, i) => (
                    <p key={i} className="error">{msg}</p>
                  ))}
            </form>

            <p className="auth-footer">
              Don’t have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
