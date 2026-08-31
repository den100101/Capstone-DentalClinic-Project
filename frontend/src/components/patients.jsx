import { useState, useEffect } from "react";
import "../styles/patient-search.css";
import TeethChart from "./teethchart";
import PatientRecord from "./patientRecords";

function Patients() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedPatients, setSelectedPatients] = useState();

  async function GetPatients() {
    try {
      const response = await fetch(`${API_URL}/get_patients`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage("Failed to load patients");
        return;
      }
      setPatients(data.patients);
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    }
  }

  useEffect(() => {
    GetPatients();
  }, []);

  return (
    <>
      <div className="patients-container">
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
              />
            </div>
          </div>
          <div className="patients-list-wrapper">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="patients-list"
                onClick={() => setSelectedPatients(patient)}
              >
                <h1>{patient.name}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className="patient-record-container">
          {selectedPatients && <PatientRecord patient={selectedPatients} />}
        </div>
      </div>
    </>
  );
}

export default Patients;
