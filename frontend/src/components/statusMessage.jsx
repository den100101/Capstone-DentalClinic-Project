import { useState } from "react";
import "../styles/statusMessage.css";

function StatusMessage({ mailStatus, statusMessage, closeModal }) {
  return (
    <>
      <div className="status-message-background">
        <div className="status-message-container">
          <div>
            <img
              src="/Images/SwissLogo.png"
              alt="swiss-logo"
              className="swiss-status-logo"
            />
          </div>
          <div className="status-message-text">
            {mailStatus && <h1>{mailStatus}</h1>}
            {!mailStatus && statusMessage && <h1>{statusMessage}</h1>}
          </div>
          <div>
            <button onClick={() => closeModal(false)} className="status-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatusMessage;
