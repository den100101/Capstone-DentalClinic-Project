import "../styles/teethmodal.css";
import { useState } from "react";

function UpdateTeethModal({ closeModal, record, onRecordUpdated }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [condition, setCondition] = useState(record.condition);
  const [treatment, setTreatment] = useState(record.treatment);
  const [notes, setNotes] = useState(record.notes);
  const [message, setMessage] = useState("");

  async function UpdateRecord(e) {
    e.preventDefault();

    const response = await fetch(
      `${API_URL}/update_tooth_record/${record.id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condition,
          treatment,
          notes,
        }),
      },
    );

    const data = await response.json();

    setMessage(data.message);

    if (response.ok) {
      onRecordUpdated();
      closeModal(false);
    }
  }

  return (
    <div className="teeth-modal-background">
      <div className="teeth-modal-container">
        <div className="teeth-modal-header">
          <h1>Update Tooth Record</h1>
          <h2>Tooth {record.tooth_number}</h2>
        </div>

        <form onSubmit={UpdateRecord}>
          <div className="tooth-inputs">
            <label>Condition</label>

            <input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>

          <div className="tooth-inputs">
            <label>Treatment</label>

            <input
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />
          </div>

          <div className="tooth-inputs">
            <label>Notes</label>

            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {message && <p className="teeth-message">{message}</p>}

          <div className="teeth-button-modal-container">
            <button type="submit" className="teeth-buttons add">
              Update Record
            </button>

            <button
              type="button"
              className="teeth-buttons close"
              onClick={() => closeModal(false)}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTeethModal;
