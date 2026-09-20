import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import "../styles/dashboard-cards.css";
import MonthlyRevenueChart from "./revenue";
import Walkin from "./walkin";
import GenerateReport from "./generatereport";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [openWalkinModal, setOpenWalkinModal] = useState(false);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [todaysAppointmentsCount, setTodaysAppointmentsCount] = useState(0);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  async function GetTodaysAppointment() {
    const response = await fetch(`${API_URL}/get_todays_appointments`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
    }
    setTodaysAppointments(data.appointments);
    setTodaysAppointmentsCount(data.total);
  }

  async function GetPendingAppointments() {
    const response = await fetch(`${API_URL}/get_pending_appointments`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
    }
    setPendingAppointmentsCount(data.pending_count);
  }

  async function GetMonthlyRevenue() {
    try {
      const response = await fetch(`${API_URL}/get_monthly_revenue`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const revenue = Number(data.monthly_revenue) || 0;

      const currentMonth = new Date().getMonth();

      const revenueData = Array(12).fill(0);
      revenueData[currentMonth] = revenue;

      setMonthlyRevenue(revenueData);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  }

  useEffect(() => {
    GetTodaysAppointment();
    GetPendingAppointments();
    GetMonthlyRevenue();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header-container">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
            </div>
            <div className="dashboard-header-p">
              <p>
                Welcome back, Admin. Here is what's happpening today at the
                clinic.
              </p>
            </div>
          </div>
          <div className="dashboard-header-buttons">
            <div
              className="dashboard-buttons generate"
              onClick={() => setOpenReportModal(true)}
            >
              <div>
                <img
                  src="/Images/report.png"
                  alt="report-icon"
                  className="dashboard-icons"
                />
              </div>

              <div>
                <h1>Generate Report</h1>
              </div>
            </div>
            <div className="dashboard-buttons add">
              <div>
                <img
                  src="/Images/add.png"
                  alt="add-icon"
                  className="dashboard-icons"
                />
              </div>
              <div onClick={() => setOpenWalkinModal(true)}>
                <h1>Walk in Appointment</h1>
              </div>
            </div>
          </div>
        </div>
        {/* DASHBOARD CARDS */}
        <div className="dashboard-cards-container">
          <div className="dashboard-cards">
            <div>
              <img
                src="/Images/revenue.png"
                alt="revenue-icon"
                className="dashboard-card-icons"
              />
            </div>
            <div>
              <h1>Monthly Revenue</h1>
            </div>
            <div>
              <h2 className="dashboard-number">
                ₱{Number(monthlyRevenue[new Date().getMonth()]) || 0}
              </h2>
            </div>
          </div>
          <div className="dashboard-cards">
            <div>
              <img
                src="/Images/calendar-black.png"
                alt="calendar-icon"
                className="dashboard-card-icons"
              />
            </div>
            <div>
              <h1>Today's Appointment</h1>
            </div>
            <div>
              <h2 className="dashboard-number">{todaysAppointmentsCount}</h2>
            </div>
          </div>
          <div className="dashboard-cards">
            <div>
              <img
                src="/Images/report.png"
                alt="report-icon"
                className="dashboard-card-icons"
              />
            </div>
            <div>
              <h1>Pending Appointments</h1>
            </div>
            <div>
              <h2 className="dashboard-number">{pendingAppointmentsCount}</h2>
            </div>
          </div>
          <div className="dashboard-cards">
            <div>
              <h1>Staff on Duty</h1>
            </div>
            <div>
              <h1>Dr. Analiza Borraz</h1>
            </div>
            <div>
              <h1>Head Dentist</h1>
            </div>
          </div>
        </div>
        <div className="dashboard-statistics">
          <div className="chart-card">
            <h2>Monthly Revenue</h2>
            <MonthlyRevenueChart />
          </div>
          <div className="todays-appointment-container">
            <div className="table-title">
              <h2>Today's Appointments</h2>
              <span>{todaysAppointmentsCount} Appointments</span>
            </div>
            <table className="todays-appointment-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Time</th>
                  <th>Treatment</th>
                </tr>
              </thead>

              <tbody>
                {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.reason_for_visit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No appointments scheduled today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {openWalkinModal && <Walkin closeModal={setOpenWalkinModal} />}

      {openReportModal && (
        <GenerateReport
          closeModal={() => setOpenReportModal(false)}
          monthlyRevenue={monthlyRevenue}
          todaysAppointmentsCount={todaysAppointmentsCount}
          pendingAppointmentsCount={pendingAppointmentsCount}
          todaysAppointments={todaysAppointments}
        />
      )}
    </>
  );
}
export default Dashboard;
