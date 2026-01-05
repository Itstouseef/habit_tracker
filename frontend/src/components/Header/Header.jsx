// src/components/Header/Header.jsx
import { useState , useEffect} from "react";
import "./Header.css";
import Logo from "../Logo/Logo";
import NavLinks from "../Navlinks/Navlinks";
import Notifications from "../Notifications/Notifications";
import UserMenu from "../UserMenu/UserMenu";
import ThemeToggle from "../ThemeToggle/ThemeToggle";


function Header({ toggleTheme, currentTheme }) {
  const [open, setOpen] = useState(false);
  
// --- ADD THIS TO LOCK THE BACKGROUND ---
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    // Cleanup function in case component unmounts while menu is open
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <header className="header">
      <Logo />

      {/* Navigation */}
      <nav className={`nav-links ${open ? "open" : ""}`}>
        <NavLinks closeMenu={() => setOpen(false)} />
      </nav>

      <div className="right-side">
        <ThemeToggle toggleTheme={toggleTheme} currentTheme={currentTheme} />
        <Notifications />
        <UserMenu />
      </div>

      {/* Mobile Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Toggle navigation"
      >
        <span className={`line line1 ${open ? "open" : ""}`}></span>
        <span className={`line line2 ${open ? "open" : ""}`}></span>
        <span className={`line line3 ${open ? "open" : ""}`}></span>
      </button>
    </header>
  );
}

export default Header;
