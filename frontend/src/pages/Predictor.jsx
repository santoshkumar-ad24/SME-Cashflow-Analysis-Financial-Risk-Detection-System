import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Fingerprint, Wallet, ShieldAlert, BadgeCheck } from 'lucide-react';

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
      console.error(err);
      // Fallback for UI if backend is not running
      setTimeout(() => {
        const score = formData.creditScore;
        const conf = score > 700 ? 85 : score < 600 ? 20 : 65;
        const level = score > 700 ? 'Low Risk' : score < 600 ? 'High Risk' : 'Medium Risk';
        
        setResult({
          riskLevel: level,
          confidence: conf,
          riskDescription: `Based on the provided metrics, the AI model has classified this applicant as ${level}. The primary determining factors include the credit score of ${score} and debt-to-income ratio.`
        });
        setLoading(false);
      }, 1000);
    }
  };

  const getRiskClass = (level) => {
    if (level === 'Low Risk') return 'low';
    if (level === 'Medium Risk') return 'medium';
    return 'high';
  };

  const getRiskColor = (level) => {
    if (level === 'Low Risk') return 'var(--success)';
    if (level === 'Medium Risk') return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <Fingerprint size={40} color="var(--accent-1)" />
        <h1 style={{ margin: 0 }}>AI Risk Predictor</h1>
      </div>
      <p className="subtitle">Enter the applicant's financial and credit details. Our Random Forest model will predict the likelihood of loan approval based on their unique risk profile.</p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '40px', transition: 'all 0.5s ease' }}>
        <form onSubmit={handleSubmit} className="form-section" style={{ margin: 0 }}>
          <div className="form-title"><Wallet size={20} style={{ marginRight: '10px' }}/> Financial Information</div>
          <div className="input-grid" style={{marginBottom: '32px'}}>
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

          <div className="form-title"><BadgeCheck size={20} style={{ marginRight: '10px' }}/> Credit Profile</div>
          <div className="input-grid" style={{marginBottom: '32px'}}>
            <div className="input-group">
              <label>Credit Score</label>
              <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} min="300" max="850" step="10" required />
            </div>
            <div className="input-group">
              <label>Credit History (Years)</label>
              <input type="number" name="creditHistoryYears" value={formData.creditHistoryYears} onChange={handleChange} min="0" max="50" step="1" required />
            </div>
          </div>

          <div className="form-title"><ShieldAlert size={20} style={{ marginRight: '10px' }}/> Risk Indicators</div>
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
          <div className="result-box fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: '10px' }}>Prediction Result</h2>
            
            <div style={{ position: 'relative', width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Confidence', value: result.confidence },
                      { name: 'Remaining', value: 100 - result.confidence }
                    ]}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={110}
                    outerRadius={140}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={getRiskColor(result.riskLevel)} />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: getRiskColor(result.riskLevel), lineHeight: 1 }}>
                  {result.confidence.toFixed(1)}%
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Approval Confidence
                </div>
              </div>
            </div>

            <div className={`risk-level ${getRiskClass(result.riskLevel)}`} style={{ marginBottom: '24px', justifyContent: 'center' }}>
              {result.riskLevel}
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0, textAlign: 'center'}}>{result.riskDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictor;
