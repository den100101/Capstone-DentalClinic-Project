import { useEffect, useState } from "react";
import "../styles/generatereport.css";

const API_URL = import.meta.env.VITE_API_URL;

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  if (!date) return "N/A";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateTime) {
  if (!dateTime) return "N/A";

  const parsedDate = new Date(
    dateTime.endsWith("Z") ? dateTime : `${dateTime}Z`,
  );

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount) || 0);
}

function getStatusClass(status) {
  return `status-${String(status || "unknown").toLowerCase()}`;
}

export default function GenerateReport() {
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!selectedDate) {
      setReport(null);
      setError("Please select a report date.");
      return;
    }

    const controller = new AbortController();

    async function fetchReport() {
      setLoading(true);
      setError("");
      setReport(null);

      try {
        const response = await fetch(
          `${API_URL}/get_daily_report?date=${encodeURIComponent(
            selectedDate,
          )}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Failed to load the daily report.");
        }

        if (!data.new_patients || !data.appointments || !data.payments) {
          throw new Error("The server returned an incomplete report.");
        }

        setReport(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        setReport(null);
        setError(err.message || "Unable to connect to the server.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchReport();

    return () => controller.abort();
  }, [selectedDate, refreshKey]);

  const newPatients = report?.new_patients?.details || [];
  const appointments = report?.appointments?.details || [];
  const payments = report?.payments?.details || [];

  const handlePrint = () => {
    if (!report || loading) return;
    window.print();
  };

  const handleRetry = () => {
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <main className="generate-report-page">
      {/* PAGE HEADER */}
      <div className="report-page-header">
        <div>
          <h1>Daily Report</h1>
          <p>
            SWISS DENTAL CLINIC — Daily clinic activity and revenue summary.
          </p>
        </div>

        <button
          type="button"
          className="report-print-btn"
          onClick={handlePrint}
          disabled={!report || loading}
        >
          Print Report
        </button>
      </div>

      {/* REPORT FILTERS */}
      <section className="report-filter-panel">
        <div className="report-date-control">
          <label htmlFor="report-date">Select Report Date</label>

          <input
            id="report-date"
            type="date"
            value={selectedDate}
            max={getLocalDate()}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        <div className="report-filter-info">
          <span>Selected Date</span>
          <strong>{formatDate(selectedDate)}</strong>
        </div>
      </section>

      {/* LOADING STATE */}
      {loading && (
        <div className="report-message" role="status">
          Loading daily report...
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="report-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            className="report-retry-btn"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      )}

      {/* REPORT */}
      {!loading && !error && report && (
        <div className="report-content">
          <div className="report-date-heading">
            <div>
              <h2>Daily Clinic Summary</h2>
              <p>{formatDate(report.report_date)}</p>
            </div>

            <div className="report-generated-label">
              <span>Report Type</span>
              <strong>Daily Summary</strong>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <section className="report-summary-grid">
            <div className="report-summary-card patients-card">
              <span>New Patients</span>
              <h3>{report.new_patients.total ?? newPatients.length}</h3>
              <p>Patients registered</p>
            </div>

            <div className="report-summary-card appointments-card">
              <span>Total Appointments</span>
              <h3>{report.appointments.total ?? appointments.length}</h3>
              <p>Scheduled appointments</p>
            </div>

            <div className="report-summary-card confirmed-card">
              <span>Confirmed</span>
              <h3>{report.appointments.confirmed ?? 0}</h3>
              <p>Confirmed appointments</p>
            </div>

            <div className="report-summary-card revenue-card">
              <span>Daily Revenue</span>
              <h3>{formatCurrency(report.payments.total_revenue)}</h3>
              <p>Payments recorded</p>
            </div>
          </section>

          {/* NEW PATIENTS */}
          <section className="report-section">
            <div className="report-section-heading">
              <h3>New Patients Added</h3>
              <span className="report-section-count">
                {newPatients.length} record(s)
              </span>
            </div>

            {newPatients.length === 0 ? (
              <p className="report-empty">
                No patients were added on this date.
              </p>
            ) : (
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Email</th>
                      <th>Time Added</th>
                    </tr>
                  </thead>

                  <tbody>
                    {newPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name || "N/A"}</td>
                        <td>{patient.email || "N/A"}</td>
                        <td>{formatTime(patient.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* APPOINTMENTS */}
          <section className="report-section">
            <div className="report-section-heading">
              <h3>Appointments</h3>
              <span className="report-section-count">
                {appointments.length} record(s)
              </span>
            </div>

            <div className="report-status-summary">
              <span className="report-status-summary-item pending-summary">
                Pending: {report.appointments.pending ?? 0}
              </span>

              <span className="report-status-summary-item confirmed-summary">
                Confirmed: {report.appointments.confirmed ?? 0}
              </span>

              <span className="report-status-summary-item declined-summary">
                Declined: {report.appointments.declined ?? 0}
              </span>
            </div>

            {appointments.length === 0 ? (
              <p className="report-empty">
                No appointments scheduled for this date.
              </p>
            ) : (
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Reason for Visit</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.patient_name || "N/A"}</td>
                        <td>{appointment.appointment_time || "N/A"}</td>
                        <td>{appointment.reason_for_visit || "N/A"}</td>
                        <td>
                          <span
                            className={`report-status ${getStatusClass(
                              appointment.status,
                            )}`}
                          >
                            {appointment.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* PAYMENTS */}
          <section className="report-section">
            <div className="report-section-heading">
              <h3>Payments and Revenue</h3>
              <span className="report-section-count">
                {report.payments.transaction_count ?? payments.length}{" "}
                transaction(s)
              </span>
            </div>

            <div className="report-payment-summary">
              <div>
                <span>Total Transactions</span>
                <strong>
                  {report.payments.transaction_count ?? payments.length}
                </strong>
              </div>

              <div>
                <span>Total Revenue</span>
                <strong>{formatCurrency(report.payments.total_revenue)}</strong>
              </div>
            </div>

            {payments.length === 0 ? (
              <p className="report-empty">No payments recorded on this date.</p>
            ) : (
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Amount</th>
                      <th>Payment Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td>{payment.payment_id}</td>
                        <td>{payment.patient_id ?? "N/A"}</td>
                        <td>{payment.patient_name || "N/A"}</td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>{formatTime(payment.payment_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="report-footer">
            <p>Generated by Swiss Dental Clinic Management System</p>
            <p>Report Date: {formatDate(report.report_date)}</p>
          </footer>
        </div>
      )}

      {!loading && !error && !report && (
        <p className="report-empty">
          Select a date to generate the daily report.
        </p>
      )}
    </main>
  );
}
