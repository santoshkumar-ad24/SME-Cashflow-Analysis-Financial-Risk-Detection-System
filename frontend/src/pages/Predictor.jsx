import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Predictor = () => {
  const [formData, setFormData] = useState({
    annualIncome: 65000,
    yearsEmployed: 5,
    currentDebt: 15000,
    creditScore: 650,
    creditHistoryYears: 7,
    defaultsOnFile: 0,
    delinquencies: 0,
    derogatoryMarks: 0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level) => {
    if (level === 'Low Risk') return 'low';
    if (level === 'Medium Risk') return 'medium';
    return 'high';
  };

  return (
    <div className="fade-in">
      <h1>Financial Risk Predictor</h1>
      <p className="subtitle">Enter the applicant's financial and credit details. The AI model will predict the likelihood of loan approval based on their risk profile.</p>

      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-title">Personal & Financial Information</div>
        <div className="input-grid" style={{marginBottom: '30px'}}>
          <div className="input-group">
            <label>Annual Income ($)</label>
            <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} min="1000" step="1000" required />
          </div>
          <div className="input-group">
            <label>Years Employed</label>
            <input type="number" name="yearsEmployed" value={formData.yearsEmployed} onChange={handleChange} min="0" max="50" step="1" required />
          </div>
          <div className="input-group">
            <label>Current Debt ($)</label>
            <input type="number" name="currentDebt" value={formData.currentDebt} onChange={handleChange} min="0" step="1000" required />
          </div>
        </div>

        <div className="form-title">Credit Profile</div>
        <div className="input-grid" style={{marginBottom: '30px'}}>
          <div className="input-group">
            <label>Credit Score</label>
            <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} min="300" max="850" step="10" required />
          </div>
          <div className="input-group">
            <label>Credit History (Years)</label>
            <input type="number" name="creditHistoryYears" value={formData.creditHistoryYears} onChange={handleChange} min="0" max="50" step="1" required />
          </div>
        </div>

        <div className="form-title">Risk Indicators</div>
        <div className="input-grid">
          <div className="input-group">
            <label>Defaults on File</label>
            <input type="number" name="defaultsOnFile" value={formData.defaultsOnFile} onChange={handleChange} min="0" max="10" step="1" required />
          </div>
          <div className="input-group">
            <label>Delinquencies (Last 2 Yrs)</label>
            <input type="number" name="delinquencies" value={formData.delinquencies} onChange={handleChange} min="0" max="20" step="1" required />
          </div>
          <div className="input-group">
            <label>Derogatory Marks</label>
            <input type="number" name="derogatoryMarks" value={formData.derogatoryMarks} onChange={handleChange} min="0" max="20" step="1" required />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Analyzing risk profile using AI...' : 'Run Risk Analysis'}
        </button>
      </form>

      {error && <div className="result-box" style={{borderColor: 'var(--error)'}}><div style={{color: 'var(--error)'}}>{error}</div></div>}

      {result && (
        <div className="result-box fade-in">
          <div className="result-header">
            <div className={`risk-level ${getRiskClass(result.riskLevel)}`}>
              {result.riskLevel === 'Low Risk' && '🟢 '}
              {result.riskLevel === 'Medium Risk' && '🟡 '}
              {result.riskLevel === 'High Risk' && '🔴 '}
              {result.riskLevel}
            </div>
            <div className="confidence">
              <strong>Approval Confidence:</strong> {result.confidence.toFixed(1)}%
            </div>
          </div>
          
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{
                width: `${result.confidence}%`,
                background: result.riskLevel === 'Low Risk' ? 'var(--success)' : result.riskLevel === 'Medium Risk' ? 'var(--warning)' : 'var(--error)'
              }}
            ></div>
          </div>
          
          <p style={{lineHeight: 1.6, color: 'var(--text-secondary)'}}>{result.riskDescription}</p>
        </div>
      )}
    </div>
  );
};

export default Predictor;
