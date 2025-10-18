import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ReportPage.css";

const ReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch the latest session report from backend
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in first");
          return;
        }

        const response = await fetch("http://localhost:5000/api/session/latest", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setReportData(data);
        } else {
          console.error("Error fetching report:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // ✅ Send report to backend for emailing
  const handleSendReport = async () => {
    if (!reportData) return;

    try {
      const response = await fetch("http://localhost:5000/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      alert(result.message || "Report sent successfully!");
    } catch (error) {
      console.error("Send report error:", error);
      alert("Failed to send report.");
    }
  };

  if (loading) {
    return (
      <div className="report-container">
        <h1>🧾 Consultation Summary</h1>
        <p>Loading report...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="report-container">
        <h1>🧾 Consultation Summary</h1>
        <p>No report found.</p>
        <Link to="/" className="report-link">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const { user, symptoms, ai_response, metadata } = reportData;

  return (
    <div className="report-container">
      <h1>🧾 Consultation Summary</h1>

      {/* Patient Info */}
      <section className="report-section">
        <h2>👤 Patient Info</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </section>

      {/* Symptoms */}
      <section className="report-section">
        <h2>🩺 Symptoms</h2>
        <p>{symptoms}</p>
      </section>

      {/* AI Response */}
      <section className="report-section">
        <h2>🔍 AI Diagnosis</h2>
        <p>{ai_response}</p>
      </section>

      {/* Metadata — optional fields like hospitals/appointments */}
      {metadata?.hospitals && metadata.hospitals.length > 0 && (
        <section className="report-section">
          <h2>🏥 Recommended Hospitals</h2>
          <ul>
            {metadata.hospitals.map((hospital, i) => (
              <li key={i}>
                {hospital.name} – {hospital.location}
              </li>
            ))}
          </ul>
        </section>
      )}

      {metadata?.appointment && (
        <section className="report-section">
          <h2>📅 Appointment Details</h2>
          <p><strong>Hospital:</strong> {metadata.appointment.hospital}</p>
          <p><strong>Date:</strong> {metadata.appointment.date}</p>
          <p><strong>Time:</strong> {metadata.appointment.time}</p>
        </section>
      )}

      {/* Actions */}
      <section className="report-section report-actions">
        <h2>📤 Share Report</h2>
        <button onClick={handleSendReport} className="report-button">
          Email Report
        </button>
        <button onClick={() => window.print()} className="report-button">
          Download as PDF
        </button>
      </section>

      {/* Disclaimer */}
      <section className="report-section">
        <p className="report-disclaimer">
          ⚠️ This report is generated based on user input and AI analysis. It is not a substitute for professional medical advice.
        </p>
      </section>

      {/* Back Link */}
      <Link to="/" className="report-link">
        ← Back to Home
      </Link>
    </div>
  );
};

export default ReportPage;
