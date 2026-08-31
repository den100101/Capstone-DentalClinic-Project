import { useState, useEffect } from "react";
import StatusMessage from "./statusMessage";
import "../styles/pending-appointments.css";

function PendingAppointments({ setTotal }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [statusMessage, setStatusMessage] = useState("");
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [mailStatus, setMailStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const lastIndex = currentPage * appointmentsPerPage;
  const firstIndex = lastIndex - appointmentsPerPage;
  const currentPendingAppointments = pendingAppointments.slice(
    firstIndex,
    lastIndex,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(pendingAppointments.length / appointmentsPerPage),
  );

  async function GetPendingAppointments() {
    const response = await fetch(`${API_URL}/get_pending_appointments`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      setStatusMessage(data.message);
      setOpenStatusModal(true);
    }
    setPendingAppointments(data.pending_appointments);
    setTotal(data.pending_count);
  }

  useEffect(() => {
    GetPendingAppointments();
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

      setAppointments((prev) =>
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

  async function SendMail(patientId) {
    const response = await fetch(`${API_URL}/send_mail`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: patientId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setMailStatus("Email sent successfully");
      setOpenStatusModal(true);
    } else {
      setMailStatus(data.message || "Email failed to send");
      setOpenStatusModal(true);
    }
  }

  async function SendDeclineMail(patientId) {
    const response = await fetch(`${API_URL}/send_declined_email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_id: patientId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMailStatus(data.message || "Email sent successfully");
      setOpenStatusModal(true);
    } else {
      setMailStatus(data.message || "Email failed to send");
      setOpenStatusModal(true);
    }
  }

  async function confirmAppointment(appointmentId, patientId) {
    const response = await fetch(
      `${API_URL}/confirm_appointment/${appointmentId}`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (response.ok) {
      setPendingAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId),
      );

      setTotal((prev) => prev - 1);

      await SendMail(patientId);
    } else {
      setStatusMessage(data.message);
      setOpenStatusModal(true);
    }
  }

  async function DeclineAppointment(appointmentId, patientId) {
    const response = await fetch(
      `${API_URL}/decline_appointments/${appointmentId}`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );
    const data = await response.json();

    if (response.ok) {
      setPendingAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId),
      );

      setTotal((prev) => prev - 1);

      await SendDeclineMail(patientId);
    } else {
      setStatusMessage(data.message);
      setOpenStatusModal(true);
    }
  }

  return (
    <>
      <div className="pending-appointment-table-container">
        <table className="pending-appointment-table">
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
            {currentPendingAppointments.map((pendings) => (
              <tr key={pendings.id}>
                <td>{pendings.patient_name}</td>
                <td>{pendings.appointment_date}</td>
                <td>{pendings.appointment_time}</td>
                <td>{pendings.reason_for_visit}</td>
                <td>{pendings.status}</td>
                <td>
                  <div className="pending-appointments-buttons-container">
                    <div>
                      <button
                        className="pending-appointment-buttons confirm"
                        disabled={pendings.status !== "Pending"}
                        onClick={() =>
                          confirmAppointment(pendings.id, pendings.patient_id)
                        }
                      >
                        {pendings.status === "Confirmed"
                          ? "Confirmed"
                          : "Confirm"}
                      </button>
                    </div>
                    <div>
                      <button
                        className="pending-appointment-buttons decline"
                        onClick={() =>
                          DeclineAppointment(pendings.id, pendings.patient_id)
                        }
                      >
                        {pendings.status === "Declined"
                          ? "Declined"
                          : "Decline"}
                      </button>
                    </div>
                    <div>
                      <button
                        className="pending-appointment-buttons delete"
                        onClick={() =>
                          DeleteAppointments(pendings.id, pendings.patient_id)
                        }
                      >
                        Delete
                      </button>
                    </div>
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

export default PendingAppointments;
