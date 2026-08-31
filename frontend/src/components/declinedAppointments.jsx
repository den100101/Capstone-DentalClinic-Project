import { useState, useEffect } from "react";
import StatusMessage from "./statusMessage";
import "../styles/declined-appointments.css";

function DeclinedAppointments({ setTotal }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [declinedAppointments, setDeclinedAppointments] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [mailStatus, setMailStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const lastIndex = currentPage * appointmentsPerPage;
  const firstIndex = lastIndex - appointmentsPerPage;
  const currentDeclinedAppointments = declinedAppointments.slice(
    firstIndex,
    lastIndex,
  );
  const totalPages = Math.ceil(
    declinedAppointments.length / appointmentsPerPage,
  );

  async function GetDeclinedAppointments() {
    try {
      const response = await fetch(`${API_URL}/get_declined_appointments`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data.message);
        return;
      }
      setDeclinedAppointments(data.declined_appointment);
      setTotal(data.declined_count);
    } catch (error) {
      setStatusMessage("Failed to fetch data!");
    }
  }

  useEffect(() => {
    GetDeclinedAppointments();
  }, []);

  async function DeleteAppointments(appointmentId, patientId) {
    try {
      let response = await fetch(
        `${API_URL}/delete_appointment/${appointmentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      let data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.message);
        setOpenStatusModal(true);
        return;
      }

      setDeclinedAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId),
      );
      setTotal((prev) => prev - 1);

      response = await fetch(`${API_URL}/delete_patients/${patientId}`, {
        method: "DELETE",
        credentials: "include",
      });

      data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.message);
        setOpenStatusModal(true);
        return;
      }

      setStatusMessage(data.message);
      setOpenStatusModal(true);
    } catch (error) {
      setStatusMessage("Something went wrong.");
      setOpenStatusModal(true);
    }
  }

  return (
    <>
      <div className="declined-table-container">
        <table className="declined-table">
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
            {currentDeclinedAppointments.map((declined) => (
              <tr key={declined.id}>
                <td>{declined.patient_name}</td>
                <td>{declined.appointment_date}</td>
                <td>{declined.appointment_time}</td>
                <td>{declined.reason_for_visit}</td>
                <td>{declined.status}</td>
                <td>
                  <div>
                    <button
                      className="declined-appointment-button"
                      onClick={() =>
                        DeleteAppointments(declined.id, declined.patient_id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

export default DeclinedAppointments;
