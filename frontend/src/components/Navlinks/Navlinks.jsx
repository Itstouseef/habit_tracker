import "./NavLinks.css";
import { Link } from "react-router-dom";

function NavLinks({ closeMenu }) {
  return (
    <ul className="nav-ul">
      <li>
        <Link to="/" onClick={closeMenu}>Dashboard</Link>
      </li>
      <li>
        <Link to="/today" onClick={closeMenu}>Today</Link>
      </li>
      <li>
        <Link to="/calendars" onClick={closeMenu}>Calendars</Link>
      </li>
      <li>
        <Link to="/habits" onClick={closeMenu}>Habits</Link>
      </li>
      <li>
        <Link to="/insights" onClick={closeMenu}>Insights</Link>
      </li>
      <li>
        <Link to="/goals" onClick={closeMenu}>Goals</Link>
      </li>
      <li>
        <Link to="/journal" onClick={closeMenu}>Journal</Link>
      </li>
    </ul>
  );
}

export default NavLinks;
