import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Results.css';
import BookAppointment from "./BookAppointment";

export default function Results() {
  const location = useLocation();
  const [symptoms, setSymptoms] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [severity, setSeverity] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (location.state) {
      setSymptoms(location.state.symptoms || "");
      setAiResponse(location.state.ai_response || "");
      setSeverity(location.state.severity || "Mild");
    }
  }, [location.state]);

  if (showBooking) {
    return <BookAppointment onBack={() => setShowBooking(false)} />;
  }

  return (
    <div className="results-container">
      <h1>AI Symptom Analysis</h1>

      {/* Symptoms */}
      <div className="symptom-section">
        <h2>Your Symptoms</h2>
        <p>{symptoms || "No symptoms provided."}</p>
        {severity && <p><strong>Severity:</strong> {severity}</p>}
      </div>

      {/* AI Response */}
      <div className="ai-section">
        <h2>AI Response</h2>
        <pre className="ai-text">{aiResponse || "No AI response available."}</pre>
      </div>

      {/* Buttons */}
      <div className="btn-container">
        <button onClick={() => setShowBooking(true)}>Book Appointment</button>
        <button onClick={() => alert("Get Report clicked")}>Get Report</button>
      </div>
    </div>
  );
}
