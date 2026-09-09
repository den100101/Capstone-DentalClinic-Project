import "./styles/admin.css";
import "./styles/sidenav.css";
import Dashboard from "./components/dashboard";
import PatientAppointments from "./components/patientAppointments";
import Patients from "./components/patients";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin({ setIsLoggedin }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [navOpen, setNavopen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      setIsLoggedin(false);
      navigate("/");
    }
  };

  async function searchPatients(value) {
    setSearch(value);
    if (!value.trim()) {
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
  }
  useEffect(() => {
    if (selectedPatient) {
      setSearch(selectedPatient);
    }
  }, [selectedPatient]);

  return (
    <>
      <div className="dashboard-nav">
        <div className="left-nav-section">
          <div className="swiss-logo-container">
            <img
              src="/Images/SwissLogo.png"
              alt="swiss-logo"
              className="dashboard-logo"
            />
          </div>
          <div className="admin-panel-header">
            <h1>Admin Panel</h1>
          </div>
        </div>
        <div className="dashboard-nav-input-section">
          <div className="search-container">
            <img
              src="/Images/search.png"
              alt="search-icon"
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search patients"
              className="search-nav-input"
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
                      console.log(
                        "Admin selected:",
                        patient.patient_name
                      );

                      setSearch(patient.patient_name);
                      setSelectedPatient(patient.patient_name);
                      setShowDropdown(false);
                      setActiveComponent("Appointments");
                    }}
                  >
                    {patient.patient_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="right-nav-section">
          <div>
            <img
              src="/Images/notify.png"
              alt="notif-icon"
              className="notify-icon"
            />
          </div>
          <div className="nav-right-admin-section">
            <div className="admin-panel-header2">
              <h1>Admin Panel</h1>
            </div>
            <div>
              <img
                src="/Images/docana2.png"
                alt="dentist-img"
                className="dashboard-dentist-img"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Side Nav */}
      <div className="admin-panel-content-container">
        <img
          src="/Images/burger-bar.png"
          alt="burger-icon"
          className={
            navOpen === true ? "side-bar-burger active" : "side-bar-burger"
          }
          onClick={() => setNavopen(!navOpen)}
        />
        <div
          className={
            navOpen === true
              ? "admin-panel-side-nav slide"
              : "admin-panel-side-nav"
          }
        >
          <ul>
            <li
              className={
                activeComponent === "Dashboard"
                  ? "side-nav-links active"
                  : "side-nav-links"
              }
              onClick={() => setActiveComponent("Dashboard")}
            >
              <div>
                <img
                  src="/Images/icon_white.png"
                  alt="dashboard-icon"
                  className="side-nav-icons"
                />
              </div>
              <div>
                <h1>Dashboard</h1>
              </div>
            </li>
            <li
              className={
                activeComponent === "Appointments"
                  ? "side-nav-links active"
                  : "side-nav-links"
              }
              onClick={() => setActiveComponent("Appointments")}
            >
              <div>
                <img
                  src="/Images/schedule_white.png"
                  alt="schedule-icon"
                  className="side-nav-icons"
                />
              </div>
              <div>
                <h1>Appointments</h1>
              </div>
            </li>
            <li
              className={
                activeComponent === "Patient"
                  ? "side-nav-links active"
                  : "side-nav-links"
              }
              onClick={() => setActiveComponent("Patients")}
            >
              <div>
                <img
                  src="/Images/patient_white.png"
                  alt="patient-icon"
                  className="side-nav-icons"
                />
              </div>
              <div>
                <h1>Patients</h1>
              </div>
            </li>
            <li
              className={
                activeComponent === "DailyReport"
                  ? "side-nav-links active"
                  : "side-nav-links"
              }
              onClick={() => setActiveComponent("DailyReport")}
            >
              <div>
                <img
                  src="/Images/setting_white.png"
                  alt="setting-icon"
                  className="side-nav-icons"
                />
              </div>
              <div>
                <h1>Daily Report</h1>
              </div>
            </li>
            <li className="side-nav-links logout" onClick={handleLogout}>
              <div>
                <img
                  src="/Images/logout_white.png"
                  alt="logout-icon"
                  className="side-nav-icons"
                />
              </div>
              <div>
                <h1>Logout</h1>
              </div>
            </li>
          </ul>
        </div>
        <div>
          {(activeComponent === "Dashboard" && <Dashboard />) ||
            (activeComponent === "Appointments" && (
              <PatientAppointments selectedPatient={selectedPatient} />
            )) ||
            (activeComponent === "Patients" && <Patients />)}
        </div>
      </div>
    </>
  );
}
export default Admin;
