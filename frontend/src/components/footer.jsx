import "../styles/footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      {/* CLINIC INFO */}
      <div className="footer-container">
        <div className="footer-clinic-info">
          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/MEDICICONRED.png"
                alt="swiss-logo"
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
                alt="location-logo"
                className="footer-info-logo"
              />
            </div>
            <div>
              <h1 className="clinic-info">
                Ledesma Bldg 11 Jordan Street, Parañaque, Philippines, 1719
              </h1>
            </div>
          </div>
          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/PHONEICONRED.png"
                alt="telephone-logo"
                className="footer-info-logo"
              />
            </div>
            <div>
              <h1 className="clinic-info">(02) 828 4130</h1>
            </div>
          </div>
          <div className="clinic-info-continer">
            <div>
              <img
                src="/Images/MAILICONRED.png"
                alt="email-logo"
                className="footer-info-logo"
              />
            </div>
            <div>
              <h1 className="clinic-info">analizaborras@yahoo.com</h1>
            </div>
          </div>
        </div>
        {/* LINKS */}
        <div className="footer-links">
          <div className="footer-link-header">
            <h1>Quick Links</h1>
          </div>
          <div className="footer-link">
            <Link to={"/"} className="footer-link-a">
              <p>Home</p>
            </Link>
          </div>
          <div className="footer-link">
            <Link to={"/about"} className="footer-link-a">
              <p>About us</p>
            </Link>
          </div>
          <div className="footer-link">
            <Link to={"/services"} className="footer-link-a">
              <p>Services</p>
            </Link>
          </div>
          <div className="footer-link">
            <p>Article</p>
          </div>
          <div className="footer-link">
            <p>Contact us</p>
          </div>
          <div className="footer-link">
            <p>Book Appointment</p>
          </div>
        </div>
        {/* CLINIC SCHEDULE */}
        <div className="footer-clinic-sched">
          <div className="clinic-sched">
            <div>
              <h1 className="clinic-sched-header">OPENING HOURS</h1>
            </div>
            <div className="sched-container">
              <div>Mon-Fri</div>
              <div>9:00 AM-6:00 PM</div>
            </div>
            <div className="sched-container">
              <div>Saturday</div>
              <div>10:00 AM-4:00 PM</div>
            </div>
            <div className="sched-container sunday">
              <div>Sunday</div>
              <div>By Appointment Only</div>
            </div>
          </div>
          <div className="clinic-socials">
            <div>
              <a
                href="https://www.facebook.com/swissdentalclinicph"
                target="_self"
              >
                <img
                  src="/Images/fblogo.jpg"
                  alt="fblogo"
                  className="social-logo"
                />
              </a>
            </div>
            <div>
              <a href="https://www.instagram.com/swissdentalph/" target="_self">
                <img
                  src="/Images/social.png"
                  alt="iglogo"
                  className="social-logo"
                />
              </a>
            </div>
            <div>
              <a href="https://www.threads.com/@swissdentalph" target="_self">
                <img
                  src="/Images/threads.png"
                  alt="threads-logo"
                  className="social-logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        &copy; 2026 Swiss Dental Clinic. All rights reserved.
        <span>Privacy Policy</span>| <span>Terms of Service</span>
      </div>
    </>
  );
}

export default Footer;
