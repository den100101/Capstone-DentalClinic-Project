import { useState } from "react";
import "../styles/walkin.css";

function Walkin({ closeModal }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");

  const [status] = useState("Pending");

  const [takenTimes, setTakenTimes] = useState([]);
  const [checkingTimes, setCheckingTimes] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [statusType, setStatusType] = useState("");

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

  function normalizeTime(time) {
    if (!time) return "";
    return String(time).slice(0, 5);
  }

  async function handleDateChange(e) {
    const selectedDate = e.target.value;

    setAppointmentDate(selectedDate);
    setAppointmentTime("");
    setTakenTimes([]);
    setAppointmentStatus("");
    setStatusType("");
    setAvailabilityChecked(false);

    if (!selectedDate) {
      setCheckingTimes(false);
      return;
    }

    setCheckingTimes(true);

    try {
      const response = await fetch(
        `${API_URL}/get_taken_times/${selectedDate}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to check available appointment times.");
      }

      const data = await response.json();

      const times = Array.isArray(data)
        ? data
        : (data.taken_times ?? data.takenTimes ?? data.times ?? []);

      const normalizedTimes = times
        .map((item) => {
          if (typeof item === "string") {
            return normalizeTime(item);
          }

          return normalizeTime(
            item.appointment_time ?? item.time ?? item.appointmentTime,
          );
        })
        .filter(Boolean);

      setTakenTimes(normalizedTimes);
      setAvailabilityChecked(true);
    } catch (error) {
      setTakenTimes([]);
      setAppointmentStatus(
        error.message || "Unable to check appointment availability.",
      );
      setStatusType("error");
    } finally {
      setCheckingTimes(false);
    }
  }

  const isTimeTaken = takenTimes.includes(normalizeTime(appointmentTime));

  const submitDisabled =
    submitting ||
    checkingTimes ||
    !availabilityChecked ||
    !appointmentDate ||
    !appointmentTime ||
    isTimeTaken;

  async function handleSubmit(e) {
    e.preventDefault();

    setAppointmentStatus("");
    setStatusType("");

    if (!appointmentDate || !appointmentTime) {
      setAppointmentStatus("Please select an appointment date and time.");
      setStatusType("error");
      return;
    }

    if (checkingTimes || !availabilityChecked) {
      setAppointmentStatus(
        "Please wait until appointment availability has been checked.",
      );
      setStatusType("error");
      return;
    }

    if (isTimeTaken) {
      setAppointmentStatus(
        "This appointment time is already taken. Please choose another time.",
      );
      setStatusType("error");
      return;
    }

    setSubmitting(true);

    try {
      // Recheck the selected time immediately before creating the patient.
      const availabilityResponse = await fetch(
        `${API_URL}/get_taken_times/${appointmentDate}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!availabilityResponse.ok) {
        throw new Error(
          "Unable to verify appointment availability. Please try again.",
        );
      }

      const availabilityData = await availabilityResponse.json();

      const currentTimes = Array.isArray(availabilityData)
        ? availabilityData
        : (availabilityData.taken_times ??
          availabilityData.takenTimes ??
          availabilityData.times ??
          []);

      const latestTakenTimes = currentTimes
        .map((item) => {
          if (typeof item === "string") {
            return normalizeTime(item);
          }

          return normalizeTime(
            item.appointment_time ?? item.time ?? item.appointmentTime,
          );
        })
        .filter(Boolean);

      if (latestTakenTimes.includes(normalizeTime(appointmentTime))) {
        setTakenTimes(latestTakenTimes);
        setAvailabilityChecked(true);
        setAppointmentTime("");
        setAppointmentStatus(
          "This time has just been taken. Please select another time.",
        );
        setStatusType("error");
        return;
      }

      // Create the patient.
      const patientResponse = await fetch(`${API_URL}/new_patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          birthdate,
          age,
          gender,
          contact_num: contact,
          address,
          weight,
          height,
        }),
      });

      const patientData = await patientResponse.json().catch(() => ({}));

      if (!patientResponse.ok) {
        throw new Error(
          patientData.message ||
            patientData.error ||
            "Failed to create the patient record.",
        );
      }

      const patientId = patientData.patient?.id;

      if (!patientId) {
        throw new Error(
          "The patient was created, but the patient ID was not returned.",
        );
      }

      // Create the appointment.
      const appointmentResponse = await fetch(`${API_URL}/new_appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          patient_id: patientId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason_for_visit: reasonForVisit,
          status,
        }),
      });

      const appointmentData = await appointmentResponse
        .json()
        .catch(() => ({}));

      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData.message ||
            appointmentData.error ||
            "Failed to create the appointment. Please try again.",
        );
      }

      setAppointmentStatus("Appointment submitted successfully!");
      setStatusType("success");

      // Close only after both requests succeed.
      closeModal(false);
    } catch (error) {
      setAppointmentStatus(
        error.message || "Something went wrong. Please try again.",
      );
      setStatusType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="walkin-modal-background">
      <form className="walkin-modal-container" onSubmit={handleSubmit}>
        <div className="walkin-modal-header">
          <h1>Add Walk-in Appointment</h1>
        </div>

        <div className="walkin-modal-inputs-container">
          {/* LEFT SIDE */}
          <div className="walkin-modal-left-inputs">
            <div className="walkin-left-inputs">
              <label htmlFor="walkin-name" className="walkin-label">
                Name:
              </label>
              <input
                id="walkin-name"
                type="text"
                name="name"
                placeholder="Enter name"
                className="walkin-inputs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="walkin-left-inputs">
              <label htmlFor="walkin-email" className="walkin-label">
                Email Address:
              </label>
              <input
                id="walkin-email"
                type="email"
                name="email"
                placeholder="Enter email address"
                className="walkin-inputs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="walkin-left-inputs">
              <label htmlFor="walkin-address" className="walkin-label">
                Address:
              </label>
              <input
                id="walkin-address"
                type="text"
                name="address"
                placeholder="Enter address"
                className="walkin-inputs"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="walkin-left-inputs">
              <label htmlFor="walkin-reason" className="walkin-label">
                Reason for Visit:
              </label>
              <input
                id="walkin-reason"
                type="text"
                name="reason"
                placeholder="Enter reason for visit"
                className="walkin-inputs"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                required
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="walkin-modal-right-inputs">
            <div className="walkin-right-inputs-container">
              <div className="walkin-right-inputs">
                <label htmlFor="walkin-age" className="walkin-label">
                  Age:
                </label>
                <input
                  id="walkin-age"
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  className="walkin-inputs"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="walkin-right-inputs">
                <label htmlFor="walkin-birthdate" className="walkin-label">
                  Birthdate:
                </label>
                <input
                  id="walkin-birthdate"
                  type="date"
                  name="birthdate"
                  className="walkin-inputs"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>

              <div className="walkin-right-inputs">
                <label htmlFor="walkin-weight" className="walkin-label">
                  Weight:
                </label>
                <input
                  id="walkin-weight"
                  type="text"
                  name="weight"
                  placeholder="Enter weight"
                  className="walkin-inputs"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="walkin-right-inputs">
                <label
                  htmlFor="walkin-appointment-date"
                  className="walkin-label"
                >
                  Appointment Date:
                </label>
                <input
                  id="walkin-appointment-date"
                  type="date"
                  name="appointmentDate"
                  className="walkin-inputs"
                  value={appointmentDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            <div className="walkin-right-inputs-container">
              <div className="walkin-right-inputs">
                <label htmlFor="walkin-gender" className="walkin-label">
                  Gender:
                </label>
                <select
                  id="walkin-gender"
                  name="gender"
                  className="walkin-inputs"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="walkin-right-inputs">
                <label htmlFor="walkin-contact" className="walkin-label">
                  Contact Number:
                </label>
                <input
                  id="walkin-contact"
                  type="tel"
                  name="contact"
                  placeholder="Contact number"
                  className="walkin-inputs"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="walkin-right-inputs">
                <label htmlFor="walkin-height" className="walkin-label">
                  Height:
                </label>
                <input
                  id="walkin-height"
                  type="text"
                  name="height"
                  placeholder="Enter height"
                  className="walkin-inputs"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className="walkin-right-inputs">
                <label
                  htmlFor="walkin-appointment-time"
                  className="walkin-label"
                >
                  Appointment Time:
                </label>
                <select
                  id="walkin-appointment-time"
                  name="time"
                  className="walkin-inputs"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  disabled={
                    !appointmentDate || checkingTimes || !availabilityChecked
                  }
                  required
                >
                  <option value="">
                    {checkingTimes
                      ? "Checking availability..."
                      : !appointmentDate
                        ? "Select a date first"
                        : !availabilityChecked
                          ? "Availability unavailable"
                          : "Select a Time"}
                  </option>

                  {timeSlots.map((time) => {
                    const taken = takenTimes.includes(time.value);

                    return (
                      <option
                        key={time.value}
                        value={time.value}
                        disabled={taken}
                      >
                        {time.label}
                        {taken ? " - Taken" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS MESSAGE */}
        {appointmentStatus && (
          <p
            role="status"
            style={{
              width: "100%",
              margin: 0,
              textAlign: "center",
              color: statusType === "success" ? "green" : "rgb(199, 8, 8)",
              fontWeight: 600,
              overflowWrap: "anywhere",
            }}
          >
            {appointmentStatus}
          </p>
        )}

        {/* BUTTONS */}
        <div className="walkin-modal-container-buttons">
          <div>
            <button
              type="submit"
              className="walkin-buttons submit"
              disabled={submitDisabled}
              style={{
                opacity: submitDisabled ? 0.6 : 1,
                cursor: submitDisabled ? "not-allowed" : "pointer",
              }}
            >
              {submitting
                ? "Submitting..."
                : checkingTimes
                  ? "Checking..."
                  : isTimeTaken
                    ? "Time Taken"
                    : "Submit"}
            </button>
          </div>

          <div>
            <button
              type="button"
              className="walkin-buttons close"
              onClick={() => closeModal(false)}
              disabled={submitting}
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Walkin;
