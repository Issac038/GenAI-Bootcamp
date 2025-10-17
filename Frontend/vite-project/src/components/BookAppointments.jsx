import { useState, useEffect } from "react";
import "./BookAppointment.css";

export default function BookAppointment({ onBack }) {
  const [hospitals, setHospitals] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [confirmation, setConfirmation] = useState(""); // For green booking message

  useEffect(() => {
    // Updated hospital names
    const mockHospitals = [
      {
        id: 1,
        name: "BBG Medical Center",
        location: "Old Airport Road",
        slots: ["10:00 AM", "11:00 AM", "2:00 PM"]
      },
      {
        id: 2,
        name: "BBG Health Clinic",
        location: "Indiranagar",
        slots: ["09:30 AM", "1:00 PM", "3:30 PM"]
      },
      {
        id: 3,
        name: "BBG Specialty Care",
        location: "Whitefield",
        slots: ["08:00 AM", "12:00 PM", "4:00 PM"]
      }
    ];
    setHospitals(mockHospitals);
  }, []);

  const handleSlotSelect = (hospitalId, slot) => {
    setSelectedSlots((prev) => ({ ...prev, [hospitalId]: slot }));
    setConfirmation(""); // Clear previous confirmation
  };

  const handleBook = (hospitalId) => {
    const slot = selectedSlots[hospitalId];
    if (!slot) {
      alert("Please select a slot first!");
      return;
    }
    setConfirmation(`Booking confirmed at ${hospitals.find(h => h.id === hospitalId).name} for ${slot}`);
  };

  return (
    <div className="appointments-container">
      <h1>Available Hospitals</h1>

      {hospitals.map((h) => (
        <div key={h.id} className="hospital-card">
          <p><strong>{h.name}</strong></p>
          <p><strong>Location:</strong> {h.location}</p>

          <div className="slots">
            {h.slots.map((slot) => (
              <button
                key={slot}
                className={selectedSlots[h.id] === slot ? "slot-selected" : ""}
                onClick={() => handleSlotSelect(h.id, slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <button className="book-btn" onClick={() => handleBook(h.id)}>
            Book
          </button>
        </div>
      ))}

      {confirmation && <p className="confirmation">{confirmation}</p>}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={onBack}>Back to Results</button>
      </div>
    </div>
  );
}
