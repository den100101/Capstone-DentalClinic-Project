import "../styles/patientsRecords.css";
import { useState, useEffect } from "react";
import TeethChart from "./teethchart";
import PatientAppointmentHistory from "./PatientAppointmentHistory";
import "../styles/balanceappointment.css";

function PatientRecord({ patient }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedNav, setSelectedNav] = useState("Medical");
  const [toothRecords, setToothRecords] = useState([]);
  const [appointmentBalance, setAppointmentBalance] = useState(null);

  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [nextBalance, setNextBalance] = useState("");
  const [mainBalance, setMainBalance] = useState("");

  const [loadingBalance, setLoadingBalance] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Physical waiver status
  const [waiverSigned, setWaiverSigned] = useState(
    Boolean(patient?.waiver_signed),
  );
  const [updatingWaiver, setUpdatingWaiver] = useState(false);

  const timeSlots = [
    { value: "09:00", label: "09:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "01:00 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" },
    { value: "17:00", label: "05:00 PM" },
    { value: "18:00", label: "06:00 PM" },
    { value: "19:00", label: "07:00 PM" },
  ];

  // Sync the waiver status when the selected patient changes
  useEffect(() => {
    setWaiverSigned(Boolean(patient?.waiver_signed));
  }, [patient?.id, patient?.waiver_signed]);

  async function getToothRecords() {
    if (!patient) return;

    try {
      const response = await fetch(
        `${API_URL}/get_tooth_record/${patient.id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setToothRecords(data.tooth_records || []);
      } else {
        setToothRecords([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAppointmentBalance() {
    if (!patient) return;

    setLoadingBalance(true);

    try {
      const response = await fetch(
        `${API_URL}/get_appointment_balance/${patient.id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointmentBalance(data);
        setMainBalance(data.balance ?? "");
        setNextBalance(data.next_balance ?? "");
        setNextDate(data.next_appointment_date ?? "");

        if (data.next_appointment_time) {
          const matchingTime = timeSlots.find(
            (time) => time.label === data.next_appointment_time,
          );

          setNextTime(matchingTime ? matchingTime.value : "");
        } else {
          setNextTime("");
        }
      } else if (response.status === 404) {
        setAppointmentBalance(null);
        setMainBalance("");
        setNextBalance("");
        setNextDate("");
        setNextTime("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBalance(false);
    }
  }

  useEffect(() => {
    if (!patient) return;

    getToothRecords();
    getAppointmentBalance();
  }, [patient?.id]);

  // Update physical waiver status in the database
  async function updateWaiverStatus(checked) {
    if (!patient || updatingWaiver) return;

    const previousStatus = waiverSigned;

    setWaiverSigned(checked);
    setUpdatingWaiver(true);

    try {
      const response = await fetch(
        `${API_URL}/update_patient_waiver/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            waiver_signed: checked,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setWaiverSigned(data.waiver_signed);
        patient.waiver_signed = data.waiver_signed;
      } else {
        setWaiverSigned(previousStatus);
        alert(data.message || "Failed to update waiver status.");
      }
    } catch (error) {
      console.log(error);
      setWaiverSigned(previousStatus);
      alert("Something went wrong while updating the waiver.");
    } finally {
      setUpdatingWaiver(false);
    }
  }

  async function updateMainBalance() {
    if (mainBalance === "") {
      alert("Please enter the main balance.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/update_main_balance/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            balance: Number(mainBalance),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointmentBalance(data.appointment_balance);
        setMainBalance(data.appointment_balance.balance);
        alert("Main balance updated successfully.");
      } else {
        alert(data.message || "Failed to update balance.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  }

  async function updateNextAppointment() {
    if (!nextDate) {
      alert("Please select an appointment date.");
      return;
    }

    if (!nextTime) {
      alert("Please select an appointment time.");
      return;
    }

    if (nextBalance === "") {
      alert("Please enter the next appointment balance.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/update_next_appointment/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            next_appointment_date: nextDate,
            next_appointment_time: nextTime,
            next_balance: Number(nextBalance),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointmentBalance(data.appointment_balance);
        setNextDate(data.appointment_balance.next_appointment_date);
        setNextBalance(data.appointment_balance.next_balance);

        // Keep the displayed time synchronized
        const matchingTime = timeSlots.find((time) => time.value === nextTime);

        if (matchingTime) {
          setNextTime(matchingTime.value);
        }

        alert("Next appointment updated successfully.");
      } else {
        alert(data.message || "Failed to update next appointment.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  }

  async function payNextAppointment() {
    if (!appointmentBalance) return;

    if (appointmentBalance.isPaid === "paid") return;

    const confirmed = window.confirm(
      `Mark ₱${Number(
        appointmentBalance.next_balance,
      ).toLocaleString()} as paid?`,
    );

    if (!confirmed) return;

    setUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/pay_next_appointment/${patient.id}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointmentBalance(data.appointment_balance);
        setMainBalance(data.appointment_balance.balance);

        alert("Next appointment payment recorded successfully.");
      } else {
        alert(data.message || "Failed to process payment.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  }

  function cancelNextAppointment() {
    if (!appointmentBalance) {
      setNextDate("");
      setNextTime("");
      setNextBalance("");
      return;
    }

    setNextDate(appointmentBalance.next_appointment_date ?? "");

    if (appointmentBalance.next_appointment_time) {
      const matchingTime = timeSlots.find(
        (time) => time.label === appointmentBalance.next_appointment_time,
      );

      setNextTime(matchingTime ? matchingTime.value : "");
    } else {
      setNextTime("");
    }

    setNextBalance(appointmentBalance.next_balance ?? "");
  }

  function cancelMainBalance() {
    setMainBalance(appointmentBalance?.balance ?? "");
  }

  function formatAppointmentDate(date) {
    if (!date) return "No appointment";

    const appointmentDate = new Date(`${date}T00:00:00`);

    return appointmentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (!patient) {
    return (
      <div className="patient-record-container">
        <p>No patient selected.</p>
      </div>
    );
  }

  return (
    <div className="patient-record-container">
      {/* PATIENT HEADER */}
      <div className="patient-record-header">
        <h1>{patient.name}</h1>

        <div className="patient-details">
          <span>{patient.email}</span>
          <span>•</span>
          <span>{patient.contact_num}</span>
        </div>
      </div>

      {/* PHYSICAL WAIVER */}
      <div className="patient-waiver-status">
        <div className="patient-waiver-info">
          <h2>Physical Waiver</h2>
          <p>
            Confirm whether the patient has signed the physical waiver at the
            clinic.
          </p>
        </div>

        <label className="patient-waiver-checkbox">
          <input
            type="checkbox"
            checked={waiverSigned}
            disabled={updatingWaiver}
            onChange={(e) => updateWaiverStatus(e.target.checked)}
          />

          <span>
            {updatingWaiver
              ? "Updating..."
              : waiverSigned
                ? "Waiver Signed"
                : "Waiver Not Signed"}
          </span>
        </label>
      </div>

      {/* STATUS CARDS */}
      <div className="patient-status-cards-container">
        {/* NEXT APPOINTMENT CARD */}
        <div className="patient-status-cards next-appointment">
          <div className="status-cards-content">
            <div className="primary-card-header">Next Appointment</div>

            <div className="card-highlight">
              {loadingBalance
                ? "Loading..."
                : formatAppointmentDate(
                    appointmentBalance?.next_appointment_date,
                  )}
            </div>

            <div className="card-support-detail">
              {appointmentBalance?.next_appointment_time || "No time set"}
            </div>
          </div>

          <div className="patient-status-icon-container next-appointment">
            <img
              src="/Images/schedule-blue.png"
              alt="Appointment"
              className="patient-record-icons"
            />
          </div>
        </div>

        {/* BALANCE CARD */}
        <div className="patient-status-cards balance">
          <div className="status-cards-content">
            <div className="primary-card-header">Balance Due</div>

            <div className="card-highlight">
              {loadingBalance
                ? "Loading..."
                : `₱${Number(
                    appointmentBalance?.balance ?? 0,
                  ).toLocaleString()}`}
            </div>

            <div className="card-support-detail">
              Next payment: ₱
              {Number(appointmentBalance?.next_balance ?? 0).toLocaleString()}
            </div>
          </div>

          <div className="patient-status-icon-container balance">
            <img
              src="/Images/warning-danger.png"
              alt="Balance"
              className="patient-record-icons"
            />
          </div>
        </div>

        {/* DENTAL STATUS CARD */}
        <div className="patient-status-cards dental-status">
          <div className="status-cards-content">
            <div className="primary-card-header">Dental Status</div>

            <div className="card-highlight">Good</div>

            <div className="card-support-detail">No urgent treatments</div>
          </div>

          <div className="patient-status-icon-container">
            <img
              src="/Images/dental-filling.png"
              alt="Dental Status"
              className="patient-record-icons"
            />
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="patient-records-nav-container">
        <div
          className={
            selectedNav === "Medical"
              ? "patient-record-nav active"
              : "patient-record-nav"
          }
          onClick={() => setSelectedNav("Medical")}
        >
          <h1>Medical History</h1>
        </div>

        <div
          className={
            selectedNav === "History"
              ? "patient-record-nav active"
              : "patient-record-nav"
          }
          onClick={() => setSelectedNav("History")}
        >
          <h1>Appointment History</h1>
        </div>

        <div
          className={
            selectedNav === "Balances"
              ? "patient-record-nav active"
              : "patient-record-nav"
          }
          onClick={() => setSelectedNav("Balances")}
        >
          <h1>Balances</h1>
        </div>
      </div>

      {/* MEDICAL HISTORY */}
      {selectedNav === "Medical" && (
        <div className="patient-medical-records-container">
          <TeethChart
            selectedPatient={patient}
            toothRecords={toothRecords}
            refreshRecords={getToothRecords}
          />

          <div className="tooth-records-table-container">
            <h2>Dental Records</h2>

            <table className="tooth-records-table">
              <thead>
                <tr>
                  <th>Tooth</th>
                  <th>Condition</th>
                  <th>Treatment</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {toothRecords.length > 0 ? (
                  toothRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.tooth_number}</td>
                      <td>{record.condition}</td>
                      <td>{record.treatment}</td>
                      <td>{record.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No dental records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPOINTMENT HISTORY */}
      {selectedNav === "History" && (
        <div className="patient-appointment-history-container">
          <PatientAppointmentHistory patient={patient} />
        </div>
      )}

      {/* BALANCES */}
      {selectedNav === "Balances" && (
        <>
          {/* NEXT APPOINTMENT */}
          <div className="modifier-container">
            <h2>Next Appointment</h2>

            <div className="modifier-inputs">
              <div>
                <label htmlFor="nextDate">Date</label>

                <input
                  type="date"
                  id="nextDate"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="nextTime">Time</label>

                <select
                  id="nextTime"
                  value={nextTime}
                  onChange={(e) => setNextTime(e.target.value)}
                >
                  <option value="">Select a Time</option>

                  {timeSlots.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modifier-actions">
              <button
                type="button"
                onClick={cancelNextAppointment}
                disabled={updating}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateNextAppointment}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {/* BALANCE DUE */}
          <div className="modifier-container">
            <h2>Balance Due</h2>

            <div className="modifier-inputs">
              <div>
                <label htmlFor="mainBalance">Main Balance Due</label>

                <input
                  type="number"
                  id="mainBalance"
                  value={mainBalance}
                  onChange={(e) => setMainBalance(e.target.value)}
                  placeholder="Enter balance"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="nextBalance">Next Appointment Balance</label>

                <input
                  type="number"
                  id="nextBalance"
                  value={nextBalance}
                  onChange={(e) => setNextBalance(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
            </div>

            <div className="modifier-actions">
              <button
                type="button"
                onClick={cancelMainBalance}
                disabled={updating}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateMainBalance}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {/* NEXT APPOINTMENT PAYMENT */}
          <div className="modifier-container">
            <h2>Next Appointment Payment</h2>

            <div className="payment-summary">
              <div>
                <span>Amount Due</span>

                <strong>
                  ₱
                  {Number(
                    appointmentBalance?.next_balance ?? 0,
                  ).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {appointmentBalance?.isPaid === "paid" ? "Paid" : "Unpaid"}
                </strong>
              </div>
            </div>

            <div className="modifier-actions">
              <button
                type="button"
                onClick={payNextAppointment}
                disabled={
                  updating ||
                  !appointmentBalance ||
                  appointmentBalance.isPaid === "paid" ||
                  Number(appointmentBalance.next_balance) <= 0
                }
              >
                {appointmentBalance?.isPaid === "paid"
                  ? "Paid ✓"
                  : updating
                    ? "Processing..."
                    : "Mark as Paid"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PatientRecord;
