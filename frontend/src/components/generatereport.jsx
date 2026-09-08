import { useState } from "react";
import "../styles/generate-reports.css";

function GenerateReport({
  closeModal,
  monthlyRevenue,
  todaysAppointmentsCount,
  pendingAppointmentsCount,
  todaysAppointments,
}) {
  const [reportType, setReportType] = useState("Daily");
  const [generated, setGenerated] = useState(false);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const monthName = today.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  // Count treatments
  const treatmentCounts = {};

  todaysAppointments.forEach((appointment) => {
    const treatment = appointment.reason_for_visit;

    if (treatment) {
      treatmentCounts[treatment] =
        (treatmentCounts[treatment] || 0) + 1;
    }
  });

  const treatmentEntries = Object.entries(treatmentCounts);

  const mostCommonTreatment =
    treatmentEntries.length > 0
      ? treatmentEntries.sort((a, b) => b[1] - a[1])[0][0]
      : "No treatment recorded";

  const generateReport = () => {
    setGenerated(true);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">

        {/* HEADER */}
        <div className="report-header">
          <div>
            <h2>Generate Report</h2>
            <p>Create a summary of clinic activities.</p>
          </div>

          <button
            className="report-close"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {/* OPTIONS */}
        <div className="report-options">

          <div className="report-input-group">
            <label>Report Type</label>

            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setGenerated(false);
              }}
            >
              <option value="Daily">Daily Report</option>
              <option value="Monthly">Monthly Report</option>
            </select>
          </div>

          <div className="report-input-group">
            <label>Date</label>

            <input
              type="text"
              value={formattedDate}
              readOnly
            />
          </div>

          <button
            className="generate-btn"
            onClick={generateReport}
          >
            Generate Report
          </button>

        </div>

        {/* GENERATED REPORT */}
        {generated && (
          <div className="generated-report">

            <div className="report-title">
              <h1>Dental Clinic Report</h1>

              <p>
                {reportType === "Monthly"
                  ? monthName
                  : formattedDate}
              </p>
            </div>

            {/* SUMMARY */}
            <div className="report-section">
              <h3>Report Summary</h3>

              {reportType === "Daily" ? (
                <>
                  <p>
                    On <strong>{formattedDate}</strong>, the clinic
                    had{" "}
                    <strong>
                      {todaysAppointmentsCount}
                    </strong>{" "}
                    scheduled appointment
                    {todaysAppointmentsCount !== 1
                      ? "s"
                      : ""}.
                  </p>

                  <p>
                    There are currently{" "}
                    <strong>
                      {pendingAppointmentsCount}
                    </strong>{" "}
                    pending appointment
                    {pendingAppointmentsCount !== 1
                      ? "s"
                      : ""}{" "}
                    requiring attention.
                  </p>

                  <p>
                    The most frequently recorded treatment today
                    was{" "}
                    <strong>
                      {mostCommonTreatment}
                    </strong>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p>
                    During <strong>{monthName}</strong>, the clinic
                    recorded a total monthly revenue of{" "}
                    <strong>
                      ₱{Number(monthlyRevenue).toLocaleString()}
                    </strong>
                    .
                  </p>

                  <p>
                    The clinic continues to monitor appointments,
                    treatments, and patient activity to maintain
                    efficient daily operations.
                  </p>
                </>
              )}

              <p>
                The clinic is currently staffed by{" "}
                <strong>Dr. Analiza Borraz</strong>, Head Dentist.
                Overall, the clinic's current activities are being
                monitored to help maintain efficient patient care
                and clinic operations.
              </p>
            </div>

            {/* STATISTICS */}
            <div className="report-statistics">

              <div className="report-stat">
                <span>Monthly Revenue</span>
                <strong>
                  ₱{Number(monthlyRevenue).toLocaleString()}
                </strong>
              </div>

              <div className="report-stat">
                <span>Today's Appointments</span>
                <strong>
                  {todaysAppointmentsCount}
                </strong>
              </div>

              <div className="report-stat">
                <span>Pending Appointments</span>
                <strong>
                  {pendingAppointmentsCount}
                </strong>
              </div>

              <div className="report-stat">
                <span>Staff on Duty</span>
                <strong>1</strong>
              </div>

            </div>

            {/* APPOINTMENTS */}
            <div className="report-section">
              <h3>Today's Appointments</h3>

              {todaysAppointments.length > 0 ? (
                <table className="report-table">

                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Treatment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {todaysAppointments.map(
                      (appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            {appointment.patient_name}
                          </td>

                          <td>
                            {appointment.appointment_time}
                          </td>

                          <td>
                            {appointment.reason_for_visit}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              ) : (
                <p className="no-report-data">
                  No appointments scheduled today.
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div className="report-footer">

              <span>
                Generated on {formattedDate}
              </span>

              <button
                className="print-btn"
                onClick={printReport}
              >
                Print Report
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default GenerateReport;