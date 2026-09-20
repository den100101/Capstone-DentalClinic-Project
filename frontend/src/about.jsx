import Footer from "./components/footer";
import { Link } from "react-router-dom";
import "./styles/about.css";
import "./styles/expertise.css";

function About() {
  return (
    <>
      <div className="about-section-container">
        <div className="about-section-header">
          <h1>About us</h1>
        </div>
        <div className="about-dentist-container">
          <div className="about-dentist-header">
            <div className="about-dentist-header1">
              <h1>Meet our Dentist</h1>
            </div>
            <div className="about-dentist-header2">
              <h1>YOUR SMILE, OUR PRIORITY.</h1>
            </div>
          </div>
          <div className="about-dentist-card-container">
            <div className="dentist-image-container">
              <img
                src="Images/docana.png"
                alt="dentist-pic"
                className="dentist-pic"
              />
            </div>
            <div className="about-dentist-content">
              <div className="content-header1">
                <h1>CHIEF DENTAL OFFICER</h1>
              </div>
              <div className="content-header2">
                <h1>Dr. Analiza P. Borras</h1>
              </div>
              <div className="about-statement-container">
                <div className="dentist-statement">
                  <p>
                    With over 15 years of dedicated practice in restorative and
                    cosmetic dentistry, Dr. Analiza P. Borras has established
                    the Swiss Dental Clinic as a cornerstone of excellence in
                    Parañaque. Her approach combines rigorous clinical precision
                    with a gentle, patient-centered philosophy.
                  </p>
                </div>
                <div className="dentist-statement">
                  <p>
                    She believes that every smile tells a story. At Swiss Dental
                    Clinic, we don't just treat teeth; we care for people. Our
                    mission is to provide a world-class dental experience that
                    is accessible, comfortable, and life-changing for our
                    community.
                  </p>
                </div>
              </div>
              <div className="about-card-buttons">
                <div>
                  <button className="about-view-button">
                    View Credentials
                  </button>
                </div>
                <div>
                  <button className="about-learn-button">
                    <Link to="/article">Learn More</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-feature-container">
          <div className="about-feature-header">
            <div className="swiss-way">
              <h1>THE SWISS WAY</h1>
            </div>
            <div className="about-feature-header2">
              <div className="why-header">
                <h1>Why Swiss Dental Clinic stands out in the Philippines</h1>
              </div>
              <div className="view-header">
                <Link to="/services" className="view-header-link">
                  <h1>View our Full Service {">"}</h1>
                </Link>
              </div>
            </div>
          </div>
          <div className="about-feature-cards-container">
            <div className="feature-cards">
              <div className="about-feature-img-container">
                <img
                  src="/Images/heart.png"
                  alt="heart-img"
                  className="about-feature-logo"
                />
              </div>
              <div className="feature-card-header">
                <h1>Compassionate Care</h1>
              </div>
              <div className="about-feature-p">
                <p>
                  We understand dental anxiety. Our team is trained to provide a
                  soothing environment that puts even the most nervous patients
                  at ease.
                </p>
              </div>
            </div>
            <div className="feature-cards">
              <div className="about-feature-img-container">
                <img
                  src="/Images/stethoscope.png"
                  alt=""
                  className="about-feature-logo"
                />
              </div>
              <div className="feature-card-header">
                <h1>Expert Precision</h1>
              </div>
              <div className="about-feature-p">
                <p>
                  Utilizing Swiss-standard dental protocols, we ensure every
                  procedure is executed with meticulous detail and long-term
                  durability.
                </p>
              </div>
            </div>
            <div className="feature-cards">
              <div className="about-feature-img-container">
                <img
                  src="/Images/diamond.png"
                  alt=""
                  className="about-feature-logo"
                />
              </div>
              <div className="feature-card-header">
                <h1>Aesthetic First</h1>
              </div>
              <div className="about-feature-p">
                <p>
                  We don't just fix problems, we craft beautiful smiles. Our
                  cosmetic procedures are tailored to enhance your natural
                  facial harmony.
                </p>
              </div>
            </div>
            <div className="feature-cards">
              <div className="about-feature-img-container">
                <img
                  src="/Images/microscope.png"
                  alt=""
                  className="about-feature-logo"
                />
              </div>
              <div className="feature-card-header">
                <h1>Advance Technology</h1>
              </div>
              <div className="about-feature-p">
                <p>
                  Using modern dental technology and innovative techniques, we
                  provide accurate diagnoses, comfortable treatments, and
                  exceptional outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="expertise-section-container">
          <div className="expertise-image-section">
            <div className="expertise-image-container">
              <img
                src="/Images/swiss-clinic.jpg"
                alt="clinic-pic"
                className="clinic-pic"
              />
            </div>
            <div className="expertise-card">
              <div className="year-h1">
                <h1>20+</h1>
              </div>
              <div className="years-h1">
                <h1>YEARS EXPERIENCE</h1>
              </div>
            </div>
          </div>
          <div className="expertise-description-section">
            <div className="expertise-description-header">
              <h1>Expertise rooted in Education and Ethics</h1>
            </div>
            <div className="expertise-description-p">
              <p>
                With years of international experience and a passion for
                transforming smiles, Dr. Analiza Borras-Anza combines clinical
                excellence with genuine patient care. Her dedication to
                continuous self-improvement and ethical dental practice has made
                Swiss Dental Clinic a trusted name in cosmetic and restorative
                dentistry.
              </p>
            </div>
            <div className="expertise-feature-container">
              <div className="expertise-content-container">
                <div className="expertise-icon-container">
                  <img
                    src="/Images/graduate.png"
                    alt="icon"
                    className="expertise-icon"
                  />
                </div>
                <div className="exertise-desctiptions">
                  <div>
                    <h1>Academic Excellence</h1>
                  </div>
                  <div className="expertise-description-p">
                    <p>
                      Licensed Dentist since 2005, with professional experience
                      in Switzerland that inspired the high-quality standards
                      and patient-centered approach of Swiss Dental Clinic.
                    </p>
                  </div>
                </div>
              </div>
              <div className="expertise-content-container">
                <div className="expertise-icon-container">
                  <img
                    src="/Images/heart.png"
                    alt="icon"
                    className="expertise-icon"
                  />
                </div>
                <div className="exertise-desctiptions">
                  <div>
                    <h1>Community Focused</h1>
                  </div>
                  <div className="expertise-description-p">
                    <p>
                      Committed to giving back through charitable dental
                      missions and providing quality oral healthcare to
                      underserved communities in Parañaque and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button className="expertise-button">
                Book a Consultation with Dr.Borras
              </button>
            </div>
          </div>
        </div>
        <div className="about-cta-container">
          <div className="about-cta-header">
            <h1>
              Join thousands of happy patients who trust their smiles to us
            </h1>
          </div>
          <div className="patient-pics">
            <div className="patient-pic-container">
              <img src="/Images/patient-1.png" alt="" className="patient-pic" />
            </div>
            <div className="patient-pic-container">
              <img src="/Images/patient-2.png" alt="" className="patient-pic" />
            </div>
            <div className="patient-pic-container">
              <img src="/Images/patient-3.png" alt="" className="patient-pic" />
            </div>
          </div>
          <div>
            <button className="about-cta-button">Book now</button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default About;
