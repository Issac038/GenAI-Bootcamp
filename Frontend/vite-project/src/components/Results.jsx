import { useState, useEffect } from "react";
import './Results.css';
import BookAppointment from "./BookAppointments";

export default function Results() {
  const [aiResponse, setAiResponse] = useState("");
  const [verifiedInfo, setVerifiedInfo] = useState([]);
  const [showBooking, setShowBooking] = useState(false); // toggle for BookAppointment

  useEffect(() => {
    setAiResponse(
      "Patient may be experiencing mild flu-like symptoms. Recommend rest, hydration, and monitoring temperature."
    );

    const mockData = [
      {
        condition: "Common Cold",
        description: "A viral infection of your nose and throat.",
        advice: "Rest, stay hydrated, and monitor symptoms."
      },
      {
        condition: "Seasonal Flu",
        description: "Influenza virus infection.",
        advice: "Get plenty of rest, drink fluids, and see a doctor if severe."
      }
    ];

    setVerifiedInfo(mockData);
  }, []);

  // If showBooking is true, render BookAppointment
  if (showBooking) {
    return <BookAppointment onBack={() => setShowBooking(false)} />;
  }

  return (
    <div className="results-container">
      <h1>AI Symptom Analysis</h1>

      {/* AI Response */}
      <div className="ai-section">
        <h2>AI Response</h2>
        <pre className="ai-text">{aiResponse || "No AI response available."}</pre>
      </div>

      {/* Verified Info */}
      <div className="verified-section">
        <h2>Verified Medical Information</h2>
        {verifiedInfo.length > 0 ? (
          verifiedInfo.map((item, idx) => (
            <div key={idx} className="info-card">
              <h3>{item.condition}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Advice:</strong> {item.advice}</p>
            </div>
          ))
        ) : (
          <p>No verified info available.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="btn-container">
        <button onClick={() => setShowBooking(true)}>Book Appointment</button>
        <button onClick={() => alert("Get Report clicked")}>Get Report</button>
      </div>
    </div>
  );
}
