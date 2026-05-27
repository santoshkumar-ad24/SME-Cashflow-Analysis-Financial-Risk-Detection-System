import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const API_URL = 'http://localhost:5000/api';

const COLORS = ['#06b6d4', '#0ea5e9']; // Cyan and Light Blue

const FinancialRisk = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/eda`);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dataset...</div>;
  if (error) return <div className="loading" style={{color: 'var(--error)'}}>Error: {error}</div>;
  if (!data) return null;

  // Format data for charts
  const pieData = Object.keys(data.statusCounts).map(key => ({
    name: key,
    value: data.statusCounts[key]
  }));

  const barData = Object.keys(data.avgCreditScoreByStatus).map(key => ({
    name: key,
    score: Math.round(data.avgCreditScoreByStatus[key])
  }));

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    <div className="fade-in">
      <h1>Financial Risk Analysis</h1>
      <p className="subtitle">Exploratory Data Analysis of the 2025 financial dataset to understand risk indicators.</p>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Applications</div>
          <div className="metric-value">{formatNumber(data.metrics.totalApplications)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Overall Approval Rate</div>
          <div className="metric-value">{data.metrics.approvalRate.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Average Annual Income</div>
          <div className="metric-value">${formatNumber(Math.round(data.metrics.avgIncome))}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Loan Approval Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Average Credit Score by Status</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
              <YAxis stroke="#64748b" domain={[500, 850]} tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialRisk;
