import "../styles/p-appointments.css";
import { useState } from "react";
import AllAppointments from "./allappointments";
import ConfirmedAppointments from "./confirmedAppointments";
import PendingAppointments from "./pendingAppointments";
import DeclinedAppointments from "./declinedAppointments";
import Walkin from "./walkin";

function PatientAppointments({ selectedPatient }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [renderTable, setRenderTable] = useState("All");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localSelectedPatient, setLocalSelectedPatient] = useState("");
  const [appointmentTotal, setAppointmentTotal] = useState(0);
  const [confirmedAppointmentTotal, setconfirmedAppointmentTotal] = useState(0);
  const [pendingAppointmentTotal, setPendingAppointmentTotal] = useState(0);
  const [declinedAppointmentTotal, setDeclinedAppointmentTotal] = useState(0);
  const [openWalkinModal, setOpenWalkinModal] = useState(false);

  const searchPatients = async (value) => {
    setSearch(value);
    if (value.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const response = await fetch(
      `${API_URL}/search_patients?q=${encodeURIComponent(value)}`,
    );
    const data = await response.json();
    setResults(data);
    setShowDropdown(true);
  };

  return (
    <>
      <div className="appointments-container">
        <div className="appointments-header-container">
          <div className="appointments-header">
            <div className="appointments-header-h1">
              <h1>Appointments</h1>
            </div>
            <div className="appointments-header-p">
              <p>
                Manage and schedule patient visits across all dental providers.
              </p>
            </div>
          </div>
          <div className="appointments-header-button">
            <div className="appointments-button">
              <div>
                <img
                  src="/Images/add.png"
                  alt="add-icon"
                  className="appointments-add-icon"
                />
              </div>
              <div
                className="appointment-button-text"
                onClick={() => setOpenWalkinModal(true)}
              >
                <h1>New Apppointment</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="appointment-search-bar">
          <div>
            <input
              type="text"
              placeholder="Search Patient"
              className="appointments-search-input"
              value={search}
              onChange={(e) => searchPatients(e.target.value)}
            />
            {showDropdown && (
              <div className="search-dropdown">
                {results.map((patient) => (
                  <div
                    key={patient.id}
                    className="search-item"
                    onClick={() => {
                      setSearch(patient.patient_name);
                      setLocalSelectedPatient(patient.patient_name);
                      setShowDropdown(false);
                    }}
                  >
                    {patient.patient_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <img
              src="/Images/search.png"
              alt="search-icon"
              className="appointments-search-icon"
            />
          </div>
        </div>
        <div className="appointments-navs-container">
          <div
            className={
              renderTable === "All"
                ? "appointments-navs active"
                : "appointments-navs"
            }
            onClick={() => setRenderTable("All")}
          >
            <div className="appointments-nav-desc">
              <h1>All Appointments</h1>
            </div>
            <div className="appointments-nav-count">
              <h1>{appointmentTotal}</h1>
            </div>
          </div>
          <div
            className={
              renderTable === "Confirmed"
                ? "appointments-navs active"
                : "appointments-navs"
            }
            onClick={() => setRenderTable("Confirmed")}
          >
            <div className="appointments-nav-desc">
              <h1>Confirmed</h1>
            </div>
            <div className="appointments-nav-count">
              <h1>{confirmedAppointmentTotal}</h1>
            </div>
          </div>
          <div
            className={
              renderTable === "Pending"
                ? "appointments-navs active"
                : "appointments-navs"
            }
            onClick={() => setRenderTable("Pending")}
          >
            <div className="appointments-nav-desc">
              <h1>Pending</h1>
            </div>
            <div className="appointments-nav-count">
              <h1>{pendingAppointmentTotal}</h1>
            </div>
          </div>
          <div
            className={
              renderTable === "Declined"
                ? "appointments-navs active"
                : "appointments-navs"
            }
            onClick={() => setRenderTable("Declined")}
          >
            <div className="appointments-nav-desc">
              <h1>Declined</h1>
            </div>
            <div className="appointments-nav-count">
              <h1>{declinedAppointmentTotal}</h1>
            </div>
          </div>
        </div>
        <div className="appointment-table">
          {(renderTable === "All" && (
            <AllAppointments
              setAppointmentTotal={setAppointmentTotal}
              selectedPatient={localSelectedPatient || selectedPatient}
            />
          )) ||
            (renderTable === "Confirmed" && (
              <ConfirmedAppointments setTotal={setconfirmedAppointmentTotal} />
            )) ||
            (renderTable === "Pending" && (
              <PendingAppointments setTotal={setPendingAppointmentTotal} />
            )) ||
            (renderTable === "Declined" && (
              <DeclinedAppointments setTotal={setDeclinedAppointmentTotal} />
            ))}
          {openWalkinModal && <Walkin closeModal={setOpenWalkinModal} />}
        </div>
      </div>
    </>
  );
}
export default PatientAppointments;
