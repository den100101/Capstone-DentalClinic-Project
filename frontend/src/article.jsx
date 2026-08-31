import Footer from "./components/footer";
import "./styles/article.css";

function Article() {
  return (
    <>
      <div className="article-container">
        <div className="article-header">
          <div className="article-header-1">
            <p>Article Education</p>
          </div>
          <div className="article-header-2">
            <h1>
              Swiss Dental Clinic by Dr. Analiza P. Borras - Your Trusted Dental
              Care in Parañaque
            </h1>
          </div>
          <div className="article-header-3">
            <p>
              Discover why families across Parañaque trust the personal touch
              and expert precision of DR.Borras and her dedicated team at Swiss
              Dental Clinic.
            </p>
          </div>
        </div>
        <div className="dentist-profile">
          <div className="profile-container">
            <div>
              <img
                src="/Images/docana2.png"
                alt="dentist-pic"
                className="article-dentist-pic"
              />
            </div>
            <div className="dentist-profile-content">
              <div className="dentist-name">
                <p>Dr.Analiza P. Borras</p>
              </div>
              <div className="dentist-role">
                <p>Lead Dentist & Founder</p>
              </div>
            </div>
          </div>
          <div className="article-timestamp-container">
            <div className="article-timestamp">
              <div>
                <img
                  src="/Images/calendar.png"
                  alt="calendar-icon"
                  className="dentist-profile-icons"
                />
              </div>
              <div className="article-timestamp-content">
                <p>April 15,2024</p>
              </div>
            </div>
            <div className="article-timestamp">
              <div>
                <img
                  src="/Images/timer.png"
                  alt="calendar-icon"
                  className="dentist-profile-icons"
                />
              </div>
              <div className="article-timestamp-content">
                <p>6 min read</p>
              </div>
            </div>
          </div>
        </div>
        <div className="article-contents">
          <div className="article-content">
            <div className="article-content-1-header">
              <h1>Why Your Smile Deserves the Best Care</h1>
            </div>
            <div className="article-contents-p">
              <p>
                At Swiss Dental Clinic, we believe a smile is more than just
                aesthetics; it’s a gateway to your overall health and
                confidence. Our practice, led by the renowned Dr. Analiza P.
                Borras, has become a cornerstone of the Parañaque community by
                blending international clinical standards with the warm,
                Filipino hospitality our patients love.
              </p>
            </div>
            <div className="article-contents-p">
              <p>
                The Swiss Dental tradition emphasizes precision and cleanliness.
                Every tool, every procedure, and every interaction is designed
                to ensure that you feel safe and expertly cared for from the
                moment you step into our modern clinic.
              </p>
            </div>
          </div>
          <div className="article-card">
            <div className="article-card-content">
              <p>
                "Many patients wait until they feel pain before visiting a
                dentist. By then, small problems like plaque buildup or early
                cavities have already worsened. Preventive care saves you from
                pain, costly treatments, and tooth loss."
              </p>
            </div>
            <div className="article-dentist-name">
              <h1>- Dr.Analiza P. Borraz</h1>
            </div>
          </div>

          <div className="article-content">
            <div className="article-content-2-header">
              <h1>
                The Importance of Regular Dental Cleaning: A Story of Prevention
              </h1>
            </div>
            <div className="article-contents-p">
              <p>
                Meet Sarah, a busy professional who neglected her dental
                check-ups for over two years. At first, she noticed slight
                sensitivity when drinking cold water, but she ignored it. Months
                passed, and what started as a minor issue turned into severe
                tooth decay, requiring an intensive root canal—a procedure that
                could have been entirely avoided with regular professional
                cleanings.
              </p>
            </div>
            <div className="article-contents-p">
              <ul>
                <li>
                  <span className="weight">Plaque Removal:</span> Brushing alone
                  cannot remove hardened tartar that builds up over months.
                </li>
                <li>
                  <span className="weight">Early Detection:</span> We scan for
                  signs of oral cancer, gum disease, and structural issues
                  before they become emergencies.
                </li>
                <li>
                  <span className="weight">Polish Shine:</span> Leave with a
                  brighter, refreshed smile that boosts your confidence
                  instantly.
                </li>
              </ul>
            </div>
          </div>
          <div className="article-content">
            <div className="article-content-3-header">
              <h1>Our Patient-First Philosophy</h1>
            </div>
            <div className="article-contents-p">
              <p>
                We understand that for many, a trip to the dentist can be
                anxiety-inducing. That's why our clinic is designed to be a
                "No-Fear Zone." From the soothing neutral colors of our waiting
                room to the gentle explanations provided before every step of
                your treatment, we prioritize your comfort as much as your
                clinical outcome.
              </p>
            </div>
          </div>
          <div>
            <div className="article-image-container">
              <img
                src="/Images/Frontpage.jpg"
                alt="clinic-pic"
                className="article-clinic-pic"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Article;
