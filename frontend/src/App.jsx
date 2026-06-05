import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Activity, CircleDollarSign, ShieldAlert, FileText, LayoutDashboard, Sun, Moon } from 'lucide-react';
import './index.css';
import './App.css';

// Pages
import Home from './pages/Home';

import Predictor from './pages/Predictor';
import ReportAnalysis from './pages/ReportAnalysis';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="app-container" data-theme={isDarkMode ? 'dark' : 'light'}>
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="nav-brand">
            <LayoutDashboard size={28} color="var(--accent-1)" />
            FinTech SME
          </div>
          
          <nav className="nav-links">
            <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Activity size={20} />
              <span>Model Analytics</span>
            </NavLink>
            <NavLink to="/predictor" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <ShieldAlert size={20} />
              <span>Risk Predictor</span>
            </NavLink>
            <NavLink to="/report-analysis" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FileText size={20} />
              <span>Annual Reports</span>
            </NavLink>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            <Route path="/predictor" element={<Predictor />} />
            <Route path="/report-analysis" element={<ReportAnalysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
