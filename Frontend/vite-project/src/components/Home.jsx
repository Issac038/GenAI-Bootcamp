import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logo from "../assets/logo.png";
import doctorImage from "../assets/doctor.webp";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const features = [
    { label: "Symptom Checker", path: "/symptom-checker" },
    { label: "Results", path: "/results" },
    { label: "Book Appointment", path: "/book-appointment" },
    { label: "Report", path: "/report" },
  ];

  const handleAuthRedirect = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Set --vh to fix mobile 100vh bug
  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', setVh);
    setVh(); // Call on load

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="Logo" className="logo" />
          <span className="nav-title">MediGen</span>
        </div>
        <div className="nav-right">
          <a href="#">Dashboard</a>
          <a href="#">Reports</a>
          <a href="#">Contact Support</a>
          {currentUser ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="logout-btn" onClick={handleAuthRedirect}>
              Login / Signup
            </button>
          )}
        </div>
      </nav>

      {/* Main Content - EXACTLY THE SAME AS BEFORE */}
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text">
            <h1>Streamline Your Medical Journey</h1>
            <p>AI-powered tools at your fingertips</p>
            <button className="feature-btn" onClick={handleAuthRedirect}>
              Get Started
            </button>
          </div>
          <div className="hero-image">
            <img src={doctorImage} alt="Doctor" />
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          {features.map(({ label, path }) => (
            <button
              key={label}
              className="feature-btn"
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}