import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import hook
import './BookAppointment.css';

export default function BookAppointment() {
  const [hospitalName, setHospitalName] = useState("");
  const [slot, setSlot] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const navigate = useNavigate(); // ✅ get navigate function

  const availableSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  const handleBook = async () => {
    if (!hospitalName) return alert("Please select a hospital!");
    if (!slot) return alert("Please select a slot!");

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to book an appointment.");

    try {
      const res = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          hospital_id: hospitalName.toLowerCase().replace(/\s/g, "_"),
          hospital_name: hospitalName,
          slot
        })
      });

      const data = await res.json();
      if (res.ok) setConfirmation(`✅ ${data.message}`);
      else alert(data.message || "Booking failed!");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="appointments-container">
      <h1>Book an Appointment</h1>

      <div className="form-group">
        <label>Hospital Name:</label>
        <input
          type="text"
          placeholder="Enter hospital name"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Select a Slot:</label>
        <div className="slots">
          {availableSlots.map(s => (
            <button
              key={s}
              className={slot === s ? "slot-selected" : ""}
              onClick={() => setSlot(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button className="book-btn" onClick={handleBook}>
        Book
      </button>

      {confirmation && <p className="confirmation">{confirmation}</p>}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => navigate("/home")}>&larr; Back</button>
      </div>
    </div>
  );
}
