import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authSlice";
import { Navigate, Link } from "react-router-dom";
import "./auth.css";

export default function Signup() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  if (user) {
    const destination =
      user.role?.toLowerCase() === "admin" ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={destination} replace />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-split-container">
        <div className="auth-left">
          <div className="auth-illustration">
            <h2>Start Your Habit Journey</h2>
            <p>Build streaks and track progress daily! </p>
            
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-page">
            <h2>Sign Up</h2>
            <p className="auth-motivation">Let’s make habits stick! </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
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
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              {error?.errors &&
                Object.values(error.errors)
                  .flat()
                  .map((msg, i) => (
                    <p key={i} className="error">{msg}</p>
                  ))}
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
