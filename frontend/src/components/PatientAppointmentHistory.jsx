import "../styles/patientAppointmentHistory.css";

function PatientAppointmentHistory({
  appointments = [],
  timeSlots,
  updateNextAppointment,
  cancelNextAppointment,
  updating,
  nextDate,
  setNextDate,
  nextTime,
  setNextTime,
  nextReason,
  setNextReason,
}) {
  function formatAppointmentDate(date) {
    if (!date) return "—";

    const appointmentDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(appointmentDate.getTime())) return "—";

    return appointmentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatPayment(amount) {
    return `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div className="patient-appointment-history-container">
      <div className="appointment-history-section">
        <h2>Appointment History</h2>

        <div className="appointment-history-table-container">
          <table className="appointment-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {formatAppointmentDate(appointment.appointment_date)}
                    </td>
                    <td>{appointment.appointment_time || "—"}</td>
                    <td>{appointment.reason_for_visit || "—"}</td>
                    <td>
                      {appointment.payment_amount != null
                        ? formatPayment(appointment.payment_amount)
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`appointment-history-status ${String(
                          appointment.status || "",
                        ).toLowerCase()}`}
                      >
                        {appointment.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-appointment-history">
                    No appointment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="next-appointment-history-section">
        <h2>Next Appointment</h2>

        <div className="next-appointment-history-form">
          <div className="next-appointment-history-field">
            <label htmlFor="historyNextDate">Date</label>

            <input
              type="date"
              id="historyNextDate"
              value={nextDate}
              onChange={(event) => setNextDate(event.target.value)}
            />
          </div>

          <div className="next-appointment-history-field">
            <label htmlFor="historyNextTime">Time</label>

            <select
              id="historyNextTime"
              value={nextTime}
              onChange={(event) => setNextTime(event.target.value)}
            >
              <option value="">Select a Time</option>

              {timeSlots.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          <div className="next-appointment-history-field">
            <label htmlFor="historyNextReason">Reason for Visit</label>

            <textarea
              id="historyNextReason"
              value={nextReason}
              onChange={(event) => setNextReason(event.target.value)}
              placeholder="Enter the reason for the dental visit"
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        <p>
          This only saves the next appointment date shown on the patient's
          record. To sign for a visit in the Balances tab, the appointment must
          first be confirmed in Pending Appointments.
        </p>

        <div className="next-appointment-history-actions">
          <button
            type="button"
            onClick={cancelNextAppointment}
            disabled={updating}
            className="next-appointment-history-cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={updateNextAppointment}
            disabled={updating}
            className="next-appointment-history-update"
          >
            {updating ? "Updating..." : "Update Appointment Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointmentHistory;
