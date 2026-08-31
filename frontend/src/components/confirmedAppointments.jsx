import { useState, useEffect } from "react";
import "../styles/confirmedAppointments.css";
import StatusMessage from "./statusMessage";

function ConfirmedAppointments({ setTotal }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [mailStatus, setMailStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const appointmentsPerPage = 5;
  const lastIndex = currentPage * appointmentsPerPage;
  const firstIndex = lastIndex - appointmentsPerPage;
  const currentAppointments = confirmedAppointments.slice(
    firstIndex,
    lastIndex,
  );
  const totalPages = Math.ceil(
    confirmedAppointments.length / appointmentsPerPage,
  );

  async function getConfirmedAppointments() {
    const response = await fetch(`${API_URL}/get_confirmed_appointments`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      setStatusMessage(data.message);
      setOpenStatusModal(true);
      return;
    }

    setConfirmedAppointments(data.confirmed_appointments);
    setTotal(data.appointment_count);
  }

  useEffect(() => {
    getConfirmedAppointments();
  }, []);

  async function SendReminderMail(patientId, appointmentId) {
    const response = await fetch(`${API_URL}/send_reminder_mail`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: patientId,
        appointment_id: appointmentId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMailStatus("Email sent successfully!");
      setOpenStatusModal(true);
    } else {
      setMailStatus(data.message || "Reminder mail failed to send");
      setOpenStatusModal(true);
    }
  }

  return (
    <>
      <div className="confirmed-table-container">
        <table className="confirmed-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentAppointments.map((appointments) => {
              return (
                <tr key={appointments.id}>
                  <td>{appointments.patient_name}</td>
                  <td>{appointments.appointment_date}</td>
                  <td>{appointments.appointment_time}</td>
                  <td>{appointments.reason_for_visit}</td>
                  <td>{appointments.status}</td>
                  <td className="confirmed-appointment-buttons-container">
                    <button
                      className="confirmed-appointment-buttons send"
                      onClick={() =>
                        SendReminderMail(
                          appointments.patient_id,
                          appointments.id,
                        )
                      }
                    >
                      Send Reminder
                    </button>
                    <button className="confirmed-appointment-buttons delete">
                      Delete Appointment
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-button"
          >
            Previous
          </button>

          <span className="pagination-pages">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
      {openStatusModal && (
        <StatusMessage
          mailStatus={mailStatus}
          statusMessage={statusMessage}
          closeModal={setOpenStatusModal}
        />
      )}
    </>
  );
}

export default ConfirmedAppointments;
