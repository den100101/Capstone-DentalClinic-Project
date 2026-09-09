import "../styles/legal-modal.css";

function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div
        className="legal-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-modal-header">
          <div>
            <span className="legal-label">SWISS DENTAL CLINIC</span>
            <h2>Privacy Policy</h2>
          </div>

          <button
            type="button"
            className="legal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="legal-modal-body">
          <p className="legal-date">
            Last updated: September 2026
          </p>

          <section>
            <h3>1. Information We Collect</h3>
            <p>
              When you submit an appointment request, Swiss Dental Clinic
              may collect information necessary to process your request
              and provide dental services.
            </p>

            <p>
              This may include your name, email address, birthdate, age,
              gender, contact number, address, weight, height, appointment
              date, appointment time, and reason for your visit.
            </p>
          </section>

          <section>
            <h3>2. How We Use Your Information</h3>
            <p>
              The information you provide may be used to process and
              manage appointments, communicate with you regarding your
              appointment, maintain patient records, and support the
              delivery of dental services.
            </p>
          </section>

          <section>
            <h3>3. Patient Records</h3>
            <p>
              Information related to patients and dental services may be
              maintained as part of the clinic's patient records.
              Access to these records should be limited to authorized
              clinic personnel.
            </p>
          </section>

          <section>
            <h3>4. Information Security</h3>
            <p>
              Swiss Dental Clinic takes reasonable measures to protect
              information stored in the system against unauthorized
              access, modification, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3>5. Information Sharing</h3>
            <p>
              Personal information should only be accessed or shared by
              authorized individuals when necessary for clinic operations,
              appointment management, patient care, or other legitimate
              purposes.
            </p>
          </section>

          <section>
            <h3>6. Data Retention</h3>
            <p>
              Patient and appointment information may be retained for as
              long as necessary to support clinic operations, maintain
              appropriate records, and fulfill applicable requirements.
            </p>
          </section>

          <section>
            <h3>7. User Rights</h3>
            <p>
              Users may contact Swiss Dental Clinic regarding concerns
              about the personal information associated with their
              appointment or patient record.
            </p>
          </section>

          <section>
            <h3>8. Cookies and Sessions</h3>
            <p>
              The system may use sessions and similar technologies to
              maintain authentication, improve security, and provide
              access to protected features.
            </p>
          </section>

          <section>
            <h3>9. Changes to This Privacy Policy</h3>
            <p>
              This Privacy Policy may be updated when necessary. Changes
              will be reflected in the updated version of this policy.
            </p>
          </section>

          <section>
            <h3>10. Contact Us</h3>
            <p>
              If you have questions or concerns about this Privacy Policy
              or how your information is handled, please contact Swiss
              Dental Clinic through its official contact channels.
            </p>
          </section>
        </div>

        <div className="legal-modal-footer">
          <button
            type="button"
            className="legal-primary-button"
            onClick={onClose}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal;

