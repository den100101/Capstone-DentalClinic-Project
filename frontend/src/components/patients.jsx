import { useState, useEffect } from "react";
import "../styles/patient-search.css";
import PatientRecord from "./patientRecords";

function Patients() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPatients, setSelectedPatients] = useState(null);

  async function GetPatients() {
    try {
      const [patientsResponse, appointmentsResponse] = await Promise.all([
        fetch(`${API_URL}/get_patients`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${API_URL}/get_confirmed_appointments`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      const patientsData = await patientsResponse.json();
      const appointmentsData = await appointmentsResponse.json();

      if (!patientsResponse.ok) {
        setMessage("Failed to load patients.");
        return;
      }

      const allPatients = patientsData.patients || [];

      // No confirmed appointments means no patients to display.
      const confirmedAppointments = appointmentsResponse.ok
        ? appointmentsData.confirmed_appointments || []
        : [];

      // Collect patient IDs from confirmed appointments.
      const confirmedPatientIds = new Set(
        confirmedAppointments.map((appointment) =>
          Number(appointment.patient_id),
        ),
      );

      // Display each patient only once.
      const confirmedPatients = allPatients.filter((patient) =>
        confirmedPatientIds.has(Number(patient.id)),
      );

      setPatients(confirmedPatients);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while loading patients.");
    }
  }

  useEffect(() => {
    GetPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="patients-container">
      {!selectedPatients ? (
        <div className="patients-list-container">
          <div className="search-patients-list">
            <div className="search-patients-list-container">
              <h1>Patient Directory</h1>
            </div>

            <div className="search-patient-container">
              <img
                src="/Images/search.png"
                alt="search-img"
                className="search-patient-icon"
              />

              <input
                type="text"
                placeholder="Search Patient"
                className="search-patients-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {message && <p>{message}</p>}

          {!message && (
            <div className="patients-list-wrapper">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="patients-list"
                    onClick={() => setSelectedPatients(patient)}
                  >
                    <h1>{patient.name}</h1>
                  </div>
                ))
              ) : (
                <p>
                  {search
                    ? "No matching patients found."
                    : "No patients with confirmed appointments."}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="patient-record-page">
          <button
            type="button"
            className="patient-back-button"
            onClick={() => setSelectedPatients(null)}
          >
            ← Back to Patients
          </button>

          <PatientRecord patient={selectedPatients} />
        </div>
      )}
    </div>
  );
}

export default Patients;
