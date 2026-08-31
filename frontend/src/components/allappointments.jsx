import "../styles/allappointments.css";
import StatusMessage from "./statusMessage";
import { useState, useEffect } from "react";

function AllAppointments({ setAppointmentTotal, selectedPatient }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [mailStatus, setMailStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const appointmentsPerPage = 5;
  const lastIndex = currentPage * appointmentsPerPage;
  const firstIndex = lastIndex - appointmentsPerPage;
  const currentAppointments = appointments.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  async function getAppointments(patient = "") {
    try {
      const res = await fetch(
        `${API_URL}/get_appointments?patient=${encodeURIComponent(patient)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const response = await res.json();
      if (!res.ok) {
        setStatusMessage(response.message);
        return;
      }
      setAppointments(response.appointments);
      setAppointmentTotal(response.appointment_total);
    } catch (error) {
      setStatusMessage(error.message);
    }
  }

  useEffect(() => {
    console.log("Fetching:", selectedPatient);
    getAppointments(selectedPatient);
  }, [selectedPatient]);

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
      setAppointmentTotal((prev) => prev - 1);

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
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: "Confirmed" }
            : appointment,
        ),
      );
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
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: "Declined" }
            : appointment,
        ),
      );
      await SendDeclineMail(patientId);
      setOpenStatusModal(true);
    } else {
      setStatusMessage(data.message);
      setOpenStatusModal(true);
    }
  }
  return (
    <>
      <div className="all-appointment-table-container">
        <table className="all-appointment-table">
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
            {currentAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient_name}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>{appointment.reason_for_visit}</td>
                <td>{appointment.status}</td>
                <td className="all-appointment-buttons-container">
                  <div>
                    <button
                      className="all-appointment-buttons confirm"
                      disabled={appointment.status !== "Pending"}
                      onClick={() =>
                        confirmAppointment(
                          appointment.id,
                          appointment.patient_id,
                        )
                      }
                    >
                      {appointment.status === "Confirmed"
                        ? "Confirmed"
                        : "Confirm"}
                    </button>
                  </div>
                  <div>
                    <button
                      className="all-appointment-buttons decline"
                      disabled={appointment.status !== "Pending"}
                      onClick={() =>
                        DeclineAppointment(
                          appointment.id,
                          appointment.patient_id,
                        )
                      }
                    >
                      {appointment.status === "Declined"
                        ? "Declined"
                        : "Decline"}
                    </button>
                  </div>
                  <div>
                    <button
                      className="all-appointment-buttons decline"
                      onClick={() =>
                        DeleteAppointments(
                          appointment.id,
                          appointment.patient_id,
                        )
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
export default AllAppointments;
