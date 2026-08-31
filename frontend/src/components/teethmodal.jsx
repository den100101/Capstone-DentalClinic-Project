import "../styles/teethmodal.css";
import { useState } from "react";

function TeethModal({ closeModal, patientId, tooth, onRecordAdded }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState("");
  const [condition, setCondition] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");

  async function AddTeethRecord(e) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/add_tooth_record`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: patientId,
        tooth_number: tooth,
        condition,
        treatment,
        notes,
      }),
    });

    const data = await response.json();

    setMessage(data.message);

    if (response.ok) {
      onRecordAdded();
      closeModal(false);
    }
  }

  return (
    <>
      <div className="teeth-modal-background">
        <div className="teeth-modal-container">
          <div className="teeth-modal-header">
            <div>
              <h1>Add Teeth Record</h1>
            </div>
            <div>
              <h1>Tooth number {tooth}</h1>
            </div>
          </div>

          <form onSubmit={AddTeethRecord}>
            <div className="teeth-record-inputs">
              <div className="tooth-inputs">
                <div>
                  <label htmlFor="condition">Condition</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                </div>
              </div>
              <div className="tooth-inputs">
                <div>
                  <label htmlFor="treatment">Treatment</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="treatment"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                  />
                </div>
              </div>
              <div className="tooth-inputs">
                <div>
                  <label htmlFor="notes">Notes</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              {message && <p className="teeth-message">{message}</p>}
            </div>
            <div className="teeth-button-modal-container">
              <div>
                <button type="submit" className="teeth-buttons add">
                  Add Record
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="teeth-buttons close"
                  onClick={() => closeModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TeethModal;
