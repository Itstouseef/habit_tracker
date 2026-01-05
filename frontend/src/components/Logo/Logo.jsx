import "./Logo.css";
import logoImg from "../../assets/images/habit-logo.png";
export default function Logo() {
  return (
    <div className="logo">
        <img src={logoImg} alt="Logo" className="logo-img" />
    </div>
  );
}
