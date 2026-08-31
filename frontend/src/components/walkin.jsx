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
  const [status, setStatus] = useState("Pending");
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
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
      closeModal(false);
      setAppointmentStatus("Appointment submitted successfully!");
    } catch (error) {
      setOpenStatus(true);
      setAppointmentStatus(error.message);
    }
  }
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
  return (
    <>
      <div className="walkin-modal-background">
        <form onSubmit={handleSubmit}>
          <div className="walkin-modal-container">
            <div className="walkin-modal-header">
              <h1>Add Walkin Appointment</h1>
            </div>
            <div className="walkin-modal-inputs-container">
              <div className="walkin-modal-left-inputs">
                <div className="walkin-left-inputs">
                  <label htmlFor="name" className="walkin-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    className="walkin-inputs"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="walkin-left-inputs">
                  <label htmlFor="email" className="walkin-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    className="walkin-inputs"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="walkin-left-inputs">
                  <label htmlFor="address" className="walkin-label">
                    Address:
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    className="walkin-inputs"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="walkin-left-inputs">
                  <label htmlFor="reason" className="walkin-label">
                    Reason for visit:
                  </label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Enter Reason for Visit"
                    className="walkin-inputs"
                    onChange={(e) => setReasonForVisit(e.target.value)}
                  />
                </div>
              </div>
              <div className="walkin-modal-right-inputs">
                <div className="walkin-right-inputs-container">
                  <div className="walkin-right-inputs">
                    <label htmlFor="age" className="walkin-label">
                      Age:
                    </label>
                    <input
                      type="text"
                      name="age"
                      placeholder="Enter Age"
                      className="walkin-inputs"
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="birthdate" className="walkin-label">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      className="walkin-inputs"
                      onChange={(e) => setBirthdate(e.target.value)}
                    />
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="weight" className="walkin-label">
                      Weight:
                    </label>
                    <input
                      type="text"
                      name="weight"
                      placeholder="Enter Weight"
                      className="walkin-inputs"
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="date" className="walkin-label">
                      Appointment Date:
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="walkin-inputs"
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="walkin-right-inputs-container">
                  <div className="walkin-right-inputs">
                    <label htmlFor="gender" className="walkin-label">
                      Gender:
                    </label>
                    <select
                      name=""
                      id=""
                      className="walkin-inputs"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="" className="walkin-inputs">
                        Select Gender
                      </option>
                      <option value="Male" className="walkin-inputs">
                        Male
                      </option>
                      <option value="Female" className="walkin-inputs">
                        Female
                      </option>
                    </select>
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="contact" className="walkin-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Contact Number"
                      className="walkin-inputs"
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="height" className="walkin-label">
                      Height:
                    </label>
                    <input
                      type="text"
                      name="height"
                      id=""
                      placeholder="Enter Height"
                      className="walkin-inputs"
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div className="walkin-right-inputs">
                    <label htmlFor="time" className="walkin-label">
                      Appointment Time:
                    </label>
                    <select
                      name="time"
                      id=""
                      className="walkin-inputs"
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    >
                      <option value="" className="walkin-inputs">
                        Select a Time:
                      </option>
                      {timeSlots.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="walkin-modal-container-buttons">
              <div>
                <button type="Submit" className="walkin-buttons submit">
                  Submit
                </button>
              </div>
              <div>
                <button
                  type="Button"
                  className="walkin-buttons close"
                  onClick={() => closeModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default Walkin;
