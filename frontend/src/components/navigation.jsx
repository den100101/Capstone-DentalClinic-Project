import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "./login";
import "../styles/navigation.css";

function Navigation({ isLoggedin, setIsLoggedin }) {
  const [navOpen, setNavOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const location = useLocation();

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <>
      <div className="nav-container">
        {/* LEFT SIDE */}
        <div className="navs">
          {/* Desktop Navigation */}
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/services">Services</Link>
            </li>

            <li>
              <Link to="/article">Article</Link>
            </li>

            <li>
              <Link to="/contactus">Contact Us</Link>
            </li>
          </ul>

          {/* Mobile Burger */}
          <img
            src="/Images/burger-bar.png"
            alt="Open navigation menu"
            className="burger-bar"
            onClick={() => setNavOpen(!navOpen)}
          />
        </div>

        {/* LOGO */}
        <div className="nav-logo">
          <img
            src="/Images/SwissLogo.png"
            alt="Swiss Dental Clinic"
            className="swiss-logo"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-buttons">
          {location.pathname !== "/appointment" && (
            <Link to="/appointment" className="book-button">
              Book Appointment
            </Link>
          )}

          {location.pathname === "/appointment" &&
            (isLoggedin ? (
              <Link to="/admin" className="login-button">
                Dashboard
              </Link>
            ) : (
              <button
                className="login-button"
                onClick={() => setLoginModal(true)}
              >
                Login
              </button>
            ))}
        </div>

        {/* MOBILE NAVIGATION */}
        <div className={`mobile-nav ${navOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="mobile-link-a" onClick={closeNav}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="mobile-link-a" onClick={closeNav}>
                About
              </Link>
            </li>

            <li>
              <Link to="/services" className="mobile-link-a" onClick={closeNav}>
                Services
              </Link>
            </li>

            <li>
              <Link to="/article" className="mobile-link-a" onClick={closeNav}>
                Article
              </Link>
            </li>

            <li>
              <Link
                to="/contactus"
                className="mobile-link-a"
                onClick={closeNav}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {loginModal && (
        <Login closeModal={setLoginModal} setIsLoggedin={setIsLoggedin} />
      )}
    </>
  );
}

export default Navigation;
