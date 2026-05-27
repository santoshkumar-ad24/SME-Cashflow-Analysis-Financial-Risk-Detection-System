import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Activity, CircleDollarSign, ShieldAlert, FileText } from 'lucide-react';
import './index.css';

// Pages
import FinancialRisk from './pages/FinancialRisk';
import Cashflow from './pages/Cashflow';
import Predictor from './pages/Predictor';
import ReportAnalysis from './pages/ReportAnalysis';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            💸 FinTech SME
          </div>
          <div className="sidebar-divider"></div>
          
          <nav>
            <NavLink to="/eda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Activity size={20} />
              <span>Financial Risk Analysis</span>
            </NavLink>
            <NavLink to="/cashflow" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <CircleDollarSign size={20} />
              <span>Cashflow Analysis</span>
            </NavLink>
            <NavLink to="/predictor" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <ShieldAlert size={20} />
              <span>AI Risk Predictor</span>
            </NavLink>
            <NavLink to="/report-analysis" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <FileText size={20} />
              <span>Annual Report Analysis</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/eda" replace />} />
            <Route path="/eda" element={<FinancialRisk />} />
            <Route path="/cashflow" element={<Cashflow />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/report-analysis" element={<ReportAnalysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
