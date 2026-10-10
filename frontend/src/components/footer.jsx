import { useState } from "react";
import "../styles/footer.css";
import "../styles/legal-modal.css";
import { Link } from "react-router-dom";
import PrivacyModal from "./privacymodal";
import TermsModal from "./TermsModal";

function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <footer className="footer-container">
        {/* CLINIC INFORMATION */}
        <div className="footer-clinic-info">
          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/MEDICICONRED.png"
                alt="Swiss Dental Clinic logo"
                className="footer-swiss-logo"
              />
            </div>

            <div>
              <h1 className="clinic-name">Swiss Dental Clinic</h1>
            </div>
          </div>

          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/location.png"
                alt="Location"
                className="footer-info-logo"
              />
            </div>
            <div>
              <p className="clinic-info">
                Ledesma Bldg 11 Jordan Street, Parañaque, Philippines, 1719
              </p>
            </div>
          </div>

          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/PHONEICONRED.png"
                alt="Telephone"
                className="footer-info-logo"
              />
            </div>
            <div>
              <p className="clinic-info">(02) 828 4130</p>
            </div>
          </div>

          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/MAILICONRED.png"
                alt="Email"
                className="footer-info-logo"
              />
            </div>
            <div>
              <p className="clinic-info">analizaborras@yahoo.com</p>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links-section">
          <div className="footer-link-header">
            <h2>Quick Links</h2>
          </div>

          <nav className="footer-links">
            <Link to="/" className="footer-link-a">
              Home
            </Link>
            <Link to="/about" className="footer-link-a">
              About Us
            </Link>
            <Link to="/services" className="footer-link-a">
              Services
            </Link>
            <Link to="/article" className="footer-link-a">
              Article
            </Link>
            <Link to="/contactus" className="footer-link-a">
              Contact Us
            </Link>
            <Link to="/appointment" className="footer-link-a">
              Book Appointment
            </Link>
          </nav>
        </div>

        {/* CLINIC SCHEDULE */}
        <div className="footer-clinic-sched">
          <div className="clinic-sched">
            <h2 className="clinic-sched-header">OPENING HOURS</h2>

            <div className="sched-container">
              <span>Mon-Fri</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>

            <div className="sched-container">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>

            <div className="sched-container sunday">
              <span>Sunday</span>
              <span>By Appointment Only</span>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="clinic-socials">
            <a
              href="https://www.facebook.com/swissdentalclinicph"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img
                src="/Images/fblogo.jpg"
                alt="Facebook"
                className="social-logo"
              />
            </a>

            <a
              href="https://www.instagram.com/swissdentalph/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                src="/Images/social.png"
                alt="Instagram"
                className="social-logo"
              />
            </a>

            <a
              href="https://www.threads.com/@swissdentalph"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
            >
              <img
                src="/Images/threads.png"
                alt="Threads"
                className="social-logo"
              />
            </a>
          </div>
        </div>
      </footer>

      {/* COPYRIGHT AND LEGAL LINKS */}
      <div className="footer-bottom">
        <p>&copy; 2026 Swiss Dental Clinic. All rights reserved.</p>

        <div className="footer-bottom-links">
          <button type="button" onClick={() => setIsPrivacyOpen(true)}>
            Privacy Policy
          </button>

          <span className="footer-divider">|</span>

          <button type="button" onClick={() => setIsTermsOpen(true)}>
            Terms of Service
          </button>
        </div>
      </div>

      {/* PRIVACY POLICY MODAL */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        agreed={agreed}
        setAgreed={setAgreed}
      />

      {/* TERMS OF USE MODAL */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}

export default Footer;
