import "./styles/hero.css";
import "./styles/feature.css";
import "./styles/cta.css";
import { Link } from "react-router-dom";
import Footer from "./components/footer";

function Home() {
  return (
    <>
      {/* Hero section */}
      <div className="hero-container">
        <div className="hero-background-blur">
          <div className="hero-description-container">
            <div className="hero-header">
              <p>Precision Dental Care</p>
            </div>
            <div className="hero-header-statement">
              <h1>
                Your smile deserves <span className="red">expert care</span>
              </h1>
            </div>
            <div className="hero-p">
              <p>
                We provide comprehensive dental treatment in a welcoming
                environment where your comfort comes first. From routine
                cleanings to advance procedures.
              </p>
            </div>
            <div className="hero-buttons">
              <div>
                <Link to="/appointment" className="hero-appointment-button">
                  Book Appointment
                </Link>
              </div>
              <div>
                <Link to="/article" className="hero-learn-button">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Feature section */}
      <div className="feature-container">
        <div className="feature-content-container">
          <div className="feature-header">
            <p>Excellence</p>
          </div>
          <div className="feature-header-statement">
            <h1>Modern dentistry meets personal attention</h1>
          </div>
          <div className="feature-header-p">
            <p>
              Our clinic combines state-of-the-art Swiss technology with a
              gentle, individualized approach to care. We believe that every
              patient deserves a unique treatment plan tailored to their
              specific needs and easthetic goals.
            </p>
          </div>
          <div className="clinic-features">
            <div className="feature-contents">
              <div className="feature-icons-container">
                <img
                  src="/Images/SECUREDICON.png"
                  alt=""
                  className="feature-icons"
                />
              </div>
              <div>
                <h1>Advance diagnostic imaging</h1>
              </div>
            </div>
            <div className="feature-contents">
              <div className="feature-icons-container">
                <img
                  src="/Images/CLOCKICON.png"
                  alt=""
                  className="feature-icons"
                />
              </div>
              <div>
                <h1>Same day-appointment availability</h1>
              </div>
            </div>
            <div className="feature-contents">
              <div className="feature-icons-container">
                <img
                  src="/Images/PEOPLEICON.png"
                  alt=""
                  className="feature-icons"
                />
              </div>
              <div>
                <h1>Compasionate, experienced dental team</h1>
              </div>
            </div>
          </div>
          <div className="feature-buttons">
            <Link to="/article" className="feature-explore-button">
              Explore
            </Link>
            <Link to="/about" className="feature-more-button">
              {" "}
              More <span className="orange">{">"}</span>
            </Link>
          </div>
        </div>
        <div className="feature-image">
          <div className="feature-pic-container">
            <img src="/Images/feature-pic.jpg" alt="" className="feature-pic" />
          </div>
        </div>
      </div>
      {/*CTA section */}
      <div className="cta-container">
        <div className="cta-header">
          <h1>Start your journey</h1>
        </div>
        <div className="cta-p">
          <p>
            Join thousands of patients who value world-class dental care. Your
            healthy, bright smile is just one appointment away.
          </p>
        </div>
        <div className="cta-buttons">
          <div>
            <Link to="/appointment" className="cta-book-button">
              Book Now
            </Link>
          </div>
          <div>
            <Link to="/about" className="cta-learn-button">
              Lean More
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
