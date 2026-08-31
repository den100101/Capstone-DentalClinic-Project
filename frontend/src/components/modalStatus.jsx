import "../styles/statusmodal.css";

function ModalStatus({ appoinmentStatus, setAppointmentStatus, closeStatus }) {
  return (
    <>
      <div className="status-modal-background">
        <div className="status-modal-container">
          <div className="modal-status-logo">
            <img
              src="/Images/SwissLogo.png"
              alt="swiss-logo"
              className="status-swiss-logo"
            />
          </div>
          <div className="status-text">{appoinmentStatus}</div>
          <div>
            <button
              onClick={() => closeStatus(false)}
              className="status-close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalStatus;
