import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

const API_URL = 'http://localhost:5000/api';
const PIE_COLORS = ['#06b6d4', '#0ea5e9', '#3b82f6'];
const BAR_COLORS = ['#06b6d4', '#ef4444', '#10b981'];

const ReportAnalysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  
  // State for missing metrics that user needs to fill
  const [creditMetrics, setCreditMetrics] = useState({
    creditScore: 650,
    creditHistoryYears: 7,
    defaultsOnFile: 0,
    delinquencies: 0,
    derogatoryMarks: 0
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setExtractedData(null);
    setPredictionResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload-report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(response.data.extractedData);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricChange = (e) => {
    const { name, value } = e.target;
    setCreditMetrics(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const payload = {
        annualIncome: extractedData.annualIncome,
        yearsEmployed: extractedData.yearsEmployed,
        currentDebt: extractedData.currentDebt,
        totalAssets: extractedData.totalAssets,
        ...creditMetrics
      };
      
      const response = await axios.post(`${API_URL}/predict`, payload);
      setPredictionResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setPredicting(false);
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { 
      notation: "compact", 
      compactDisplay: "short", 
      style: "currency", 
      currency: "USD",
      maximumFractionDigits: 2
    }).format(num);
  };

  const getRiskClass = (level) => {
    if (level === 'Low Risk') return 'low';
    if (level === 'Medium Risk') return 'medium';
    return 'high';
  };

  return (
    <div className="fade-in">
      <h1>Annual Report Analysis</h1>
      <p className="subtitle">Upload a company's annual report (.pdf or .csv) to automatically extract financial data, visualize its health, and predict loan risk.</p>

      {/* Upload Zone */}
      {!extractedData && (
        <div className="form-section" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed', borderWidth: '2px' }}>
          <UploadCloud size={64} color="var(--accent-1)" style={{ marginBottom: '20px' }} />
          <h2 style={{ marginBottom: '10px' }}>Upload Annual Report</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Drag and drop or browse for a .pdf or .csv file</p>
          
          <input 
            type="file" 
            id="report-upload" 
            accept=".pdf,.csv" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <label htmlFor="report-upload" className="btn-submit" style={{ width: 'auto', margin: 0, background: '#f1f5f9', color: 'var(--text-primary)' }}>
              Browse Files
            </label>
            <button className="btn-submit" onClick={handleUpload} disabled={!file || loading} style={{ width: 'auto', margin: 0 }}>
              {loading ? 'Analyzing...' : 'Analyze Report'}
            </button>
          </div>
          {file && <div style={{ marginTop: '20px', color: 'var(--success)', fontWeight: '600' }}><CheckCircle2 size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'5px'}}/> {file.name} selected</div>}
        </div>
      )}

      {error && <div className="result-box" style={{borderColor: 'var(--error)', marginTop: '20px'}}><div style={{color: 'var(--error)'}}>{error}</div></div>}

      {/* Extracted Data Visualization */}
      {extractedData && (
        <div className="fade-in">
          
          <div className="form-title" style={{marginTop: '20px'}}>Financial Health Overview</div>
          <div className="metrics-grid">
            <div className="metric-card" style={{borderColor: 'var(--accent-1)'}}>
              <div className="metric-title" style={{display:'flex', alignItems:'center', gap:'8px'}}><DollarSign size={16}/> Total Assets</div>
              <div className="metric-value">{formatCurrency(extractedData.totalAssets)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title" style={{display:'flex', alignItems:'center', gap:'8px'}}><TrendingUp size={16}/> Net Income</div>
              <div className="metric-value" style={{color: 'var(--success)'}}>{formatCurrency(extractedData.netIncome)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title" style={{display:'flex', alignItems:'center', gap:'8px'}}><Activity size={16}/> Earnings Per Share (EPS)</div>
              <div className="metric-value">${extractedData.eps.toFixed(2)}</div>
            </div>
          </div>

          <div className="charts-grid" style={{marginTop: '24px'}}>
            <div className="chart-card fade-in" style={{gridColumn: '1 / -1'}}>
              <div className="chart-title">Quarterly Revenue & Net Income Trend</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={extractedData.quarterlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="quarter" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#06b6d4" strokeWidth={3} dot={{ stroke: '#06b6d4', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card fade-in">
              <div className="chart-title">Estimated Revenue Breakdown</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={extractedData.revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {extractedData.revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card fade-in">
              <div className="chart-title">Cash Flow Statement Summary</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={extractedData.cashFlowStatement} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                  <XAxis dataKey="category" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {extractedData.profitability.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Missing Credit Metrics Form */}
          <div className="form-section fade-in">
            <div className="form-title">Missing Credit Metrics</div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '24px'}}>Annual reports rarely contain personal/SME credit history. Please verify or update the default credit parameters below before predicting risk.</p>
            
            <div className="input-grid" style={{marginBottom: '24px'}}>
              <div className="input-group">
                <label>Credit Score</label>
                <input type="number" name="creditScore" value={creditMetrics.creditScore} onChange={handleMetricChange} min="300" max="850" step="10" />
              </div>
              <div className="input-group">
                <label>Credit History (Years)</label>
                <input type="number" name="creditHistoryYears" value={creditMetrics.creditHistoryYears} onChange={handleMetricChange} min="0" max="50" step="1" />
              </div>
            </div>

            <div className="input-grid">
              <div className="input-group">
                <label>Defaults on File</label>
                <input type="number" name="defaultsOnFile" value={creditMetrics.defaultsOnFile} onChange={handleMetricChange} min="0" max="10" step="1" />
              </div>
              <div className="input-group">
                <label>Delinquencies (Last 2 Yrs)</label>
                <input type="number" name="delinquencies" value={creditMetrics.delinquencies} onChange={handleMetricChange} min="0" max="20" step="1" />
              </div>
              <div className="input-group">
                <label>Derogatory Marks</label>
                <input type="number" name="derogatoryMarks" value={creditMetrics.derogatoryMarks} onChange={handleMetricChange} min="0" max="20" step="1" />
              </div>
            </div>

            <button className="btn-submit" onClick={handlePredict} disabled={predicting}>
              {predicting ? 'Calculating Risk Profile...' : 'Predict AI Risk'}
            </button>
          </div>
        </div>
      )}

      {/* Prediction Result */}
      {predictionResult && (
        <div className="result-box fade-in">
          <div className="result-header">
            <div className={`risk-level ${getRiskClass(predictionResult.riskLevel)}`}>
              {predictionResult.riskLevel === 'Low Risk' && '🟢 '}
              {predictionResult.riskLevel === 'Medium Risk' && '🟡 '}
              {predictionResult.riskLevel === 'High Risk' && '🔴 '}
              {predictionResult.riskLevel}
            </div>
            <div className="confidence">
              <strong>Approval Confidence:</strong> {predictionResult.confidence.toFixed(1)}%
            </div>
          </div>
          
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{
                width: `${predictionResult.confidence}%`,
                background: predictionResult.riskLevel === 'Low Risk' ? 'var(--success)' : predictionResult.riskLevel === 'Medium Risk' ? 'var(--warning)' : 'var(--error)'
              }}
            ></div>
          </div>
          
          <p style={{lineHeight: 1.6, color: 'var(--text-secondary)'}}>{predictionResult.riskDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;
