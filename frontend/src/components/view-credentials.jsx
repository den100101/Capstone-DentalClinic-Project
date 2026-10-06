import React from "react";
import "../styles/credentials.css";

function CredentialsModal({ setOpenModal }) {
  return (
    <div className="credentials-overlay" onClick={() => setOpenModal(false)}>
      <div className="credentials-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="credentials-close"
          onClick={() => setOpenModal(false)}
        >
          &times;
        </button>

        <div className="credentials-header">
          <div className="credentials-icon">
            <img
              src="/Images/SwissLogo.png"
              alt="swisslogo"
              className="c-modal-img"
            />
          </div>

          <div>
            <span className="credentials-label">PROFESSIONAL CREDENTIALS</span>

            <h2>Dr. Analiza Borraz</h2>

            <p>DMD / Licensed Dentist</p>
          </div>
        </div>

        <div className="credentials-body">
          <div className="credential-item">
            <div className="credential-number">01</div>

            <div>
              <h3>Doctor of Dental Medicine</h3>

              <p>
                Doctor of Dental Medicine (DMD) and licensed dentist,
                professionally qualified to provide dental care and treatment.
              </p>
            </div>
          </div>

          <div className="credential-item">
            <div className="credential-number">02</div>

            <div>
              <h3>Licensed Dentist</h3>

              <p>
                Listed as a licensed dentist in the Philippine Dentist Licensure
                Examination records.
              </p>
            </div>
          </div>

          <div className="credential-item">
            <div className="credential-number">03</div>

            <div>
              <h3>Owner & Lead Dentist</h3>

              <p>
                Owner and Lead Dentist of Swiss Dental Clinic in Parañaque,
                providing professional dental services and patient-centered
                care.
              </p>
            </div>
          </div>

          <div className="credential-item">
            <div className="credential-number">04</div>

            <div>
              <h3>Research Author</h3>

              <p>
                Research author of{" "}
                <strong>
                  "Calcium and its Effect on Bone and Tooth Mineralization"
                </strong>
                , focusing on the importance of calcium in bone and tooth
                mineralization.
              </p>
            </div>
          </div>
        </div>

        <div className="credentials-footer">
          <i className="fas fa-shield-alt"></i>

          <span>Professional Dental Credentials</span>
        </div>
      </div>
    </div>
  );
}

export default CredentialsModal;
