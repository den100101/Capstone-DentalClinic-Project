import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "./login";
import "../styles/navigation.css";

function Navigation({ isLoggedin, setIsLoggedin }) {
  const [navOpen, setNavOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const location = useLocation();
  return (
    <>
      <div className="nav-container">
        <div className="navs">
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
            <Link to="/contactus">Contact Us</Link>
          </ul>
          <img
            src="/Images/burger-bar.png"
            alt=""
            className="burger-bar"
            onClick={() => setNavOpen(!navOpen)}
          />
        </div>

        <div className="nav-logo">
          <img
            src="/Images/SwissLogo.png"
            alt="swiss-logo"
            className="swiss-logo"
          />
        </div>

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
              <Link
                to="/appointment"
                onClick={() => setLoginModal(true)}
                className="login-button"
              >
                Login
              </Link>
            ))}
        </div>

        <div className={`mobile-nav ${navOpen ? "active" : ""}`}>
          <ul>
            <img
              src="/Images/burger-bar.png"
              alt=""
              className="burger-bar active"
              onClick={() => setNavOpen(!navOpen)}
            />
            <li>
              <Link to="/" className="mobile-link-a">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="mobile-link-a">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="mobile-link-a">
                Services
              </Link>
            </li>
            <li>
              <Link to="/article" className="mobile-link-a">
                Article
              </Link>
            </li>
            <Link to="/contactus" className="mobile-link-a">
              Contact Us
            </Link>
          </ul>
        </div>
      </div>
      {loginModal && (
        <Login closeModal={setLoginModal} setIsLoggedin={setIsLoggedin} />
      )}
    </>
  );
}

export default Navigation;
