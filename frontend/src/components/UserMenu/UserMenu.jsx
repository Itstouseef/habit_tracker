import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { logoutUser } from "../../redux/authSlice";
import "./UserMenu.css";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get the current user from Redux state
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="user-menu">
      <button className="user-avatar" onClick={() => setOpen(!open)}>
        {/* Show user initials or generic icon */}
        {user?.name?.charAt(0).toUpperCase() || "👤"}
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <hr />
          
          <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          
          {/* LOGIC: Only show Admin Dashboard if the user role is 'Admin' */}
          {user?.role?.toLowerCase() === "admin" && (
            <Link 
              to="/admin/dashboard" 
              className="admin-link" 
              onClick={() => setOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;