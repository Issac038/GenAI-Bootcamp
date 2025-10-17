import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ReportPage.css';


const ReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data setup
  useEffect(() => {
    const mockReport = {
      name: 'Pranav',
      age: 28,
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      conditions: ['Viral Infection', 'Seasonal Flu'],
      hospitals: [
        { name: 'CityCare Hospital', location: 'Ernakulam' },
        { name: 'Sunrise Clinic', location: 'Kochi' },
      ],
      appointment: {
        hospital: 'CityCare Hospital',
        date: '2025-10-18',
        time: '11:00 AM',
      },
    };

    setReportData(mockReport);
    setLoading(false);
  }, []);

  // Send report to backend
  const handleSendReport = async () => {
    if (!reportData) return;

    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      alert(result.message || 'Report sent successfully!');
    } catch (error) {
      console.error('Send report error:', error);
      alert('Failed to send report.');
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

  return (
    <div className="report-container">
      <h1>🧾 Consultation Summary</h1>

      {/* Patient Info */}
      <section className="report-section">
        <h2>👤 Patient Info</h2>
        <p><strong>Name:</strong> {reportData.name}</p>
        <p><strong>Age:</strong> {reportData.age}</p>
      </section>

      {/* Symptoms */}
      <section className="report-section">
        <h2>🩺 Symptoms</h2>
        <ul>
          {reportData.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </section>

      {/* Probable Conditions */}
      <section className="report-section">
        <h2>🔍 Probable Conditions</h2>
        <ul>
          {reportData.conditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </section>

      {/* Recommended Hospitals */}
      <section className="report-section">
        <h2>🏥 Recommended Hospitals</h2>
        <ul>
          {reportData.hospitals.map((hospital, index) => (
            <li key={index}>
              {hospital.name} – {hospital.location}
            </li>
          ))}
        </ul>
      </section>

      {/* Appointment Details */}
      <section className="report-section">
        <h2>📅 Appointment Details</h2>
        <p><strong>Hospital:</strong> {reportData.appointment.hospital}</p>
        <p><strong>Date:</strong> {reportData.appointment.date}</p>
        <p><strong>Time:</strong> {reportData.appointment.time}</p>
      </section>

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
