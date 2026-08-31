import Footer from "./components/footer.jsx";
import "./styles/appointment.css";
import ModalStatus from "./components/modalStatus.jsx";
import { useState, useEffect } from "react";

function Appointment() {
  const API_URL = import.meta.env.VITE_API_URL;
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
  const [status, setStatus] = useState("Pending");

  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [openStatus, setOpenStatus] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [takenTimes, setTakenTimes] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const patientResponse = await fetch(`${API_URL}/new_patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (!patientResponse.ok) {
        throw new Error("You already have an appointment.");
      }

      const patientData = await patientResponse.json();

      const appointmentResponse = await fetch(`${API_URL}/new_appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientData.patient.id,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason_for_visit: reasonForVisit,
          status,
        }),
      });

      if (!appointmentResponse.ok) {
        setOpenStatus(true);
        setAppointmentStatus("You already have an existing appointment.");
      }
      setOpenStatus(true);
      setAppointmentStatus("Appointment submitted successfully!");
    } catch (error) {
      setOpenStatus(true);
      setAppointmentStatus(error.message);
    }
  }

  useEffect(() => {
    if (!appointmentDate) return;

    async function getTakenTimes() {
      try {
        const response = await fetch(
          `${API_URL}/get_taken_times/${appointmentDate}`,
        );

        const data = await response.json();

        if (response.ok) {
          setTakenTimes(data.taken_times);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getTakenTimes();
  }, [appointmentDate]);

  return (
    <>
      <div className="appointment-container">
        <div className="appointment-card">
          <div className="clinic-brand">
            <div>
              <img
                src="/Images/MEDICICONRED.png"
                alt="swiss-logo"
                className="swiss-brand-logo"
              />
            </div>
            <div className="clinic-brand-name">
              <h1>Swiss Dental Clinic</h1>
            </div>
          </div>
          <div className="appointment-desc">
            <div className="appointment-desc-header">
              <h1>Appointment Request Form</h1>
            </div>
            <div className="appointment-desc-p">
              <p>
                Please be informed that this is not yet a confirmed booking. Our
                Patient Support Team will contact you shortly to confirm your
                schedule and provide pre-visit instructions. Thank you for
                choosing Swiss Dental.
              </p>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="appointment-form">
                <div className="left-form">
                  <div className="customer-info">
                    <label htmlFor="name" className="labels">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="inputs"
                    />
                  </div>
                  <div className="customer-info">
                    <label htmlFor="email" className="labels">
                      Email Address:
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                      className="inputs"
                    />
                  </div>
                  <div className="customer-info">
                    <label htmlFor="address" className="labels">
                      Address:
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="inputs"
                      placeholder="4242 example street"
                      required
                    />
                  </div>
                  <div className="customer-info">
                    <label htmlFor="" className="labels">
                      Reason for visit:
                    </label>
                    <input
                      type="text"
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                      required
                      className="inputs"
                      placeholder="e.g., Routine cleaning, toothache"
                    />
                  </div>
                </div>
                <div className="right-form">
                  <div className="grouped-inputs">
                    <div className="customer-info">
                      <label htmlFor="age" className="labels">
                        Age:
                      </label>
                      <input
                        type="text"
                        name="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your Age"
                        required
                        className="inputs short"
                      />
                    </div>
                    <div className="customer-info">
                      <label htmlFor="gender" className="labels">
                        Gender:
                      </label>
                      <select
                        name="contact-type"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="inputs short"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grouped-inputs">
                    <div className="customer-info">
                      <label htmlFor="" className="labels">
                        Birthdate:
                      </label>
                      <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        required
                        className="inputs short"
                      />
                    </div>
                    <div className="customer-info">
                      <label htmlFor="contact-num" className="labels">
                        Contact Number:
                      </label>
                      <input
                        type="text"
                        name="contact-num"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+63 xxx xxx xxxx"
                        required
                        className="inputs short"
                      />
                    </div>
                  </div>
                  <div className="grouped-inputs">
                    <div className="customer-info">
                      <label htmlFor="weight" className="labels">
                        Weight:
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight in kg"
                        required
                        className="inputs short"
                      />
                    </div>
                    <div className="customer-info">
                      <label htmlFor="height" className="labels">
                        Height:
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height in ft"
                        required
                        className="inputs short"
                      />
                    </div>
                  </div>
                  <div className="grouped-inputs">
                    <div className="customer-info">
                      <label htmlFor="date" className="labels" required>
                        Appointment Date:
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={appointmentDate}
                        min={today}
                        onChange={(e) => {
                          setAppointmentDate(e.target.value);
                          setAppointmentTime("");
                        }}
                        required
                        className="inputs short"
                      />
                    </div>
                    <div className="customer-info">
                      <label htmlFor="time" className="labels">
                        Appointment Time:
                      </label>
                      <select
                        className="inputs short"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time) => (
                          <option
                            key={time.value}
                            value={time.value}
                            disabled={takenTimes.includes(time.value)}
                          >
                            {time.label}
                            {takenTimes.includes(time.value)
                              ? " (Unavailable)"
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-section">
                <div className="data-regulation-container">
                  <div>
                    <img
                      src="/Images/verified.png"
                      alt="verified-img"
                      className="verified-logo"
                    />
                  </div>
                  <div className="data-encrypt">
                    <div className="privacy-consent">
                      <input type="checkbox" id="privacy" required />
                      <label htmlFor="privacy">
                        I agree to the Privacy Policy.
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </div>
              <div className="terms-policy-container">
                <div className="terms">Terms of use</div>
                <div className="private">Privacy & Policy</div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {openStatus && (
        <ModalStatus
          appoinmentStatus={appointmentStatus}
          setAppointmentStatus={setAppointmentStatus}
          closeStatus={setOpenStatus}
        />
      )}
      <Footer />
    </>
  );
}

export default Appointment;
