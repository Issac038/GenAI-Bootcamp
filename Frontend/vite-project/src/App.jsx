import React from 'react'
import SymptomCheckerChat from './components/SymptomCheckerChat'
import BookAppointment from './components/BookAppointments'
import Results from './components/Results'
import AuthPage from './components/AuthPage'
import ReportPage from './components/ReportPage'
import './App.css'
import './components/globalstyle.css';


function App() {
  return (
    <div className="App">
      <AuthPage />
      <SymptomCheckerChat />
      <Results />
      <BookAppointment />
      <ReportPage />
    
    </div>
  )
}

export default App