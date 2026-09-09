import "../styles/legal-modal.css";

function TermsModal({ isOpen, onClose }) {
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
            <h2>Terms of Use</h2>
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
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using the Swiss Dental Clinic appointment
              system, you agree to comply with these Terms of Use. If you
              do not agree with these terms, please do not use the system.
            </p>
          </section>

          <section>
            <h3>2. Use of the Appointment System</h3>
            <p>
              The appointment system allows patients to submit requests
              for dental appointments and provide information necessary
              for the clinic to process those requests.
            </p>

            <p>
              Submitting an appointment request does not automatically
              guarantee an appointment. Your requested schedule must first
              be reviewed and confirmed by the clinic.
            </p>
          </section>

          <section>
            <h3>3. Accurate Information</h3>
            <p>
              You are responsible for providing accurate and complete
              information when submitting your appointment request.
              This includes your name, contact information, birthdate,
              address, and other information requested by the system.
            </p>
          </section>

          <section>
            <h3>4. Appointment Requests</h3>
            <p>
              Appointment requests are initially marked as pending and
              may be confirmed, declined, or otherwise managed by
              authorized clinic personnel.
            </p>

            <p>
              The clinic may contact you to verify your information,
              confirm your appointment, or provide additional
              instructions before your visit.
            </p>
          </section>

          <section>
            <h3>5. Cancellation and Rescheduling</h3>
            <p>
              If you are unable to attend your scheduled appointment,
              please contact the clinic as soon as possible to request
              cancellation or rescheduling.
            </p>
          </section>

          <section>
            <h3>6. Prohibited Activities</h3>
            <p>
              Users must not attempt to gain unauthorized access to the
              system, access another patient's information, modify
              records without authorization, interfere with system
              operations, or use the system for unlawful purposes.
            </p>
          </section>

          <section>
            <h3>7. System Availability</h3>
            <p>
              The clinic may temporarily restrict or suspend access to
              the appointment system for maintenance, updates, security,
              or other operational reasons.
            </p>
          </section>

          <section>
            <h3>8. Changes to These Terms</h3>
            <p>
              Swiss Dental Clinic may update these Terms of Use when
              necessary. Updated terms will be reflected in the system.
            </p>
          </section>

          <section>
            <h3>9. Contact</h3>
            <p>
              For questions regarding these Terms of Use, please contact
              Swiss Dental Clinic through its official contact channels.
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

export default TermsModal;

