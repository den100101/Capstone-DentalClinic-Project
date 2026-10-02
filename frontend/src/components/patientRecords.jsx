import "../styles/patientsRecords.css";
import { useState, useEffect } from "react";
import TeethChart from "./teethchart";
import PatientAppointmentHistory from "./PatientAppointmentHistory";
import PatientBudget from "./PatientBudget";
import PatientSignature from "./PatientSignature";
import "../styles/balanceappointment.css";

function PatientRecord({ patient }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [selectedNav, setSelectedNav] = useState("Medical");
  const [toothRecords, setToothRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentBalance, setAppointmentBalance] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [savingSignature, setSavingSignature] = useState(false);

  const [budget, setBudget] = useState({
    balance: 0,
    total_paid: 0,
    remaining: 0,
    payments: [],
  });

  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [nextBalance, setNextBalance] = useState("");
  const [mainBalance, setMainBalance] = useState("");

  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [updating, setUpdating] = useState(false);

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
        setToothRecords(data.tooth_records);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAppointments() {
    if (!patient) return;

    try {
      const response = await fetch(
        `${API_URL}/get_appointments?patient=${encodeURIComponent(
          patient.name,
        )}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAppointments(data.appointments || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.log(error);
      setAppointments([]);
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

  async function getPatientBudget() {
    if (!patient) return;

    setLoadingBudget(true);

    try {
      const response = await fetch(
        `${API_URL}/get_patient_budget/${patient.id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setBudget(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBudget(false);
    }
  }

  useEffect(() => {
    getToothRecords();
    getAppointments();
    getAppointmentBalance();
    getPatientBudget();
  }, [patient]);

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

        await getPatientBudget();

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
    if (!appointmentBalance) {
      return;
    }

    if (appointmentBalance.isPaid === "paid") {
      return;
    }

    const confirmed = window.confirm(
      `Mark ₱${Number(
        appointmentBalance.next_balance,
      ).toLocaleString()} as paid?`,
    );

    if (!confirmed) {
      return;
    }

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

        await getPatientBudget();

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

  function formatAppointmentDate(date) {
    if (!date) {
      return "No appointment";
    }

    const appointmentDate = new Date(`${date}T00:00:00`);

    return appointmentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatCurrency(amount) {
    return `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatPaymentDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleSaveSignature(signature) {
    if (!patient?.id) return;

    setSavingSignature(true);

    try {
      const response = await fetch(
        `${API_URL}/save_patient_signature/${patient.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            signature,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save signature.");
        return;
      }

      setShowSignature(false);

      // Continue with payment after signature is saved
      await payNextAppointment();
    } catch (error) {
      console.error(error);
      alert("Failed to save signature.");
    } finally {
      setSavingSignature(false);
    }
  }

  return (
    <>
      {/* PATIENT RECORD */}
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

        {/* STATUS CARDS */}
        {selectedNav === "Medical" && (
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
                  alt="patient-card-icons"
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
                  {Number(
                    appointmentBalance?.next_balance ?? 0,
                  ).toLocaleString()}
                </div>
              </div>

              <div className="patient-status-icon-container balance">
                <img
                  src="/Images/warning-danger.png"
                  alt="patient-card-icons"
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
                  alt="patient-card-icons"
                  className="patient-record-icons"
                />
              </div>
            </div>
          </div>
        )}

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
      </div>

      {/* APPOINTMENT HISTORY */}
      {selectedNav === "History" && (
        <PatientAppointmentHistory
          patient={patient}
          appointments={appointments}
          appointmentBalance={appointmentBalance}
          timeSlots={timeSlots}
          updateNextAppointment={updateNextAppointment}
          cancelNextAppointment={cancelNextAppointment}
          updating={updating}
          nextDate={nextDate}
          setNextDate={setNextDate}
          nextTime={nextTime}
          setNextTime={setNextTime}
        />
      )}

      {/* BALANCES */}
      {selectedNav === "Balances" && (
        <div className="patient-balances-container">
          {/* LEFT - BUDGET */}
          <div className="patient-balances-left">
            <PatientBudget
              patient={patient}
              API_URL={API_URL}
              budget={budget}
              mainBalance={mainBalance}
              setMainBalance={setMainBalance}
              updating={updating}
              updateMainBalance={updateMainBalance}
              loading={loadingBudget}
            />
          </div>

          {/* CENTER - PAYMENT HISTORY */}
          <div className="patient-balances-center">
            <h2>Payment History</h2>

            {loadingBudget ? (
              <p className="patient-no-payments">Loading payment history...</p>
            ) : budget.payments.length > 0 ? (
              <div className="patient-payment-history-table-wrapper">
                <table className="patient-payment-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {budget.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{formatPaymentDate(payment.payment_date)}</td>

                        <td>{formatCurrency(payment.amount)}</td>

                        <td>
                          <span className="patient-payment-paid">Paid</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="patient-no-payments">No payment history found.</p>
            )}
          </div>

          {/* RIGHT - NEXT APPOINTMENT PAYMENT */}
          <div className="patient-balances-right">
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
                  onClick={() => setShowSignature(true)}
                  disabled={
                    updating ||
                    savingSignature ||
                    !appointmentBalance ||
                    appointmentBalance.isPaid === "paid" ||
                    Number(appointmentBalance.next_balance) <= 0
                  }
                >
                  {appointmentBalance?.isPaid === "paid"
                    ? "Paid ✓"
                    : updating || savingSignature
                      ? "Processing..."
                      : "Mark as Paid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSignature && (
        <PatientSignature
          onSave={handleSaveSignature}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </>
  );
}

export default PatientRecord;
