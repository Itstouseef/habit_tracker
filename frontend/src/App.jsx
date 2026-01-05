import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/authSlice";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Snowfall from "react-snowfall";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Calendars from "./pages/Calendars/Calendars";
import Dashboard from "./pages/Dashboard/Dashboard";
import Habits from "./pages/Habits/Habits";
import Insights from "./pages/Insights/Insights";
import Goals from "./pages/Goals/Goals";
import Journal from "./pages/Journal/Journal";
import Today from "./pages/Today/Today";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// ----------------------------------------------------------------------
// 1. Conditional Layout Wrapper
// This component hides Header/Footer on Login and Signup pages
// ----------------------------------------------------------------------
const ConditionalLayout = ({ children, toggleTheme, theme }) => {
  const location = useLocation();
  
  // Define paths where Header and Footer should NOT appear
  const authPaths = ["/login", "/signup"];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <>
      {/* Show Header only if we are NOT on a login/signup page */}
      {!isAuthPage && <Header toggleTheme={toggleTheme} currentTheme={theme} />}
      
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Snowfall
          style={{
            pointerEvents: "none",
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 1,
          }}
          snowflakeCount={150}
          speed={[0.5, 1.5]}
          wind={[-0.5, 0.5]}
          color="white"
        />

        <main className={isAuthPage ? "auth-main" : "main-content"}>
          {children}
        </main>
      </div>

      {/* Show Footer only if we are NOT on a login/signup page */}
      {!isAuthPage && <Footer />}
    </>
  );
};

// ----------------------------------------------------------------------
// 2. Main App Component
// ----------------------------------------------------------------------
function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    // Fetch current authenticated user on app load
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Show loading while fetching user
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <ConditionalLayout toggleTheme={toggleTheme} theme={theme}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : user.role?.toLowerCase() === "admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" />}
          />

          {/* Protected user routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/today"
            element={
              <ProtectedRoute>
                <Today />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendars"
            element={
              <ProtectedRoute>
                <Calendars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  user
                    ? user.role?.toLowerCase() === "admin"
                      ? "/admin/dashboard"
                      : "/dashboard"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </ConditionalLayout>
    </Router>
  );
}

export default App;