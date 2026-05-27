import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = 'http://localhost:5000/api';

const PIE_COLORS = ['#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6', '#d946ef'];

const Cashflow = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    channel: 'All',
    transactionType: 'All',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/cashflow`, filters);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  if (!data && loading) return <div className="loading">Processing massive transactions data...</div>;
  if (!data) return null;

  const formatCurrency = (num) => `$${new Intl.NumberFormat().format(num.toFixed(2))}`;

  // Format data for Channel pie chart
  const channelData = Object.keys(data.channelSpending).map(key => ({
    name: key,
    value: data.channelSpending[key]
  }));

  return (
    <div className="fade-in">
      <h1>Cashflow Analysis Dashboard</h1>
      <p className="subtitle">Deep dive into SME transactions. Use filters to identify specific spending patterns and cashflow stability.</p>

      {/* Filters */}
      <div className="filters-bar">
        <div className="input-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        </div>
        <div className="input-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
        <div className="input-group">
          <label>Transaction Channel</label>
          <select name="channel" value={filters.channel} onChange={handleFilterChange}>
            {data.options.channels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Transaction Type</label>
          <select name="transactionType" value={filters.transactionType} onChange={handleFilterChange}>
            {data.options.types.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="input-group" style={{justifyContent: 'flex-end'}}>
          <button className="btn-submit" onClick={applyFilters} style={{marginTop: 0, padding: '12px 20px'}}>Apply Filters</button>
        </div>
      </div>

      {loading && <div style={{textAlign: 'center', marginBottom: '20px', color: 'var(--accent-1)'}}>Updating data...</div>}

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">🟢 Total Inflow (Credit)</div>
          <div className="metric-value">{formatCurrency(data.metrics.inflow)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">🔴 Total Outflow (Debit)</div>
          <div className="metric-value">{formatCurrency(data.metrics.outflow)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">🔵 Net Cashflow</div>
          <div className="metric-value">{formatCurrency(data.metrics.net)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="chart-card">
          <div className="chart-title">Transaction Flow Over Time (Monthly)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.timeSeries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              <Line type="monotone" dataKey="Credit" stroke="#06b6d4" strokeWidth={3} dot={{ stroke: '#06b6d4', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 8, stroke: '#06b6d4', strokeWidth: 2, fill: '#fff' }} />
              <Line type="monotone" dataKey="Debit" stroke="#8b5cf6" strokeWidth={3} dot={{ stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Spending by Channel (Debits)</div>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
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
          ) : (
            <div style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px'}}>No debit data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cashflow;
