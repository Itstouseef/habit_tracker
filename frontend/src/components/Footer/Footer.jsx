import "./Footer.css";
import { FaInstagram, FaGithub, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "../Logo/Logo";


function Footer() {
  return (
    <footer className="footer">
      {/* Left: Logo + Tagline */}
      <div className="footer-left">
        <Logo/>
        <p className="footer-tagline">Track. Improve. Achieve.</p>
      </div>

      {/* Right: Socials */}
      <div className="footer-socials">
  <a href="#" aria-label="Instagram"><FaInstagram /></a>
  <a href="#" aria-label="X / Twitter"><FaXTwitter /></a>
  <a href="#" aria-label="Facebook"><FaFacebookF /></a>
  <a href="#" aria-label="GitHub"><FaGithub /></a>
</div>


      {/* Copy */}
      <div className="footer-copy">
        © {new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
