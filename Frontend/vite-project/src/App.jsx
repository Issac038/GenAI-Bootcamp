import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import SymptomCheckerChat from "./components/SymptomCheckerChat";
import BookAppointment from "./components/BookAppointments";
import Results from "./components/Results";
import AuthPage from "./components/AuthPage";
import ReportPage from "./components/ReportPage";
import "./App.css";
import "./components/globalstyle.css";
import Home from "./components/Home";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/symptom-checker" element={<SymptomCheckerChat />} />
          <Route path="/results" element={<Results />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;