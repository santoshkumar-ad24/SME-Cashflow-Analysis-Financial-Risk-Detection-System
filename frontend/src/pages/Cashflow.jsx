import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Filter, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
const BAR_COLORS = ['#06b6d4', '#22d3ee'];

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
      // Fallback for UI visualization if backend fails/isn't running
      setData({
        metrics: { inflow: 1250000, outflow: 980000, net: 270000 },
        options: { channels: ['All', 'Web', 'Mobile', 'Branch'], types: ['All', 'Transfer', 'Payment', 'Deposit'] },
        timeSeries: [
          { month: 'Jan', Credit: 150000, Debit: 120000 },
          { month: 'Feb', Credit: 180000, Debit: 140000 },
          { month: 'Mar', Credit: 160000, Debit: 160000 },
          { month: 'Apr', Credit: 210000, Debit: 130000 },
          { month: 'May', Credit: 190000, Debit: 150000 }
        ],
        channelSpending: { 'Vendor Payment': 450000, 'Payroll': 300000, 'Utilities': 150000, 'Taxes': 80000 },
        transactionTypes: [
          { name: 'Wire Transfer', amount: 500000 },
          { name: 'ACH', amount: 350000 },
          { name: 'Credit Card', amount: 100000 },
          { name: 'Cash', amount: 30000 }
        ]
      });
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

  const formatCurrency = (num) => {
    if(num >= 1000000) return `$${(num/1000000).toFixed(2)}M`;
    if(num >= 1000) return `$${(num/1000).toFixed(1)}k`;
    return `$${new Intl.NumberFormat().format(num.toFixed(2))}`;
  };

  // Format data for Channel pie chart
  const channelData = Object.keys(data.channelSpending).map(key => ({
    name: key,
    value: data.channelSpending[key]
  }));

  // Fallback transaction types if backend doesn't provide it
  const typeData = data.transactionTypes || [
    { name: 'B2B Transfer', amount: 450000 },
    { name: 'Payroll ACH', amount: 320000 },
    { name: 'Tax Payment', amount: 120000 },
    { name: 'Misc Fee', amount: 90000 }
  ];

  return (
    <div className="fade-in">
      <h1>Cashflow Analysis Dashboard</h1>
      <p className="subtitle">Deep dive into SME transactions. Identify spending patterns, cashflow stability, and financial liquidity in real-time.</p>

      {/* Filters */}
      <div className="filters-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-1)', fontWeight: 'bold', marginRight: '10px' }}>
          <Filter size={20} /> Filters:
        </div>
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
        <div className="input-group" style={{ flex: '0 1 auto' }}>
          <button className="btn-submit" onClick={applyFilters} style={{ marginTop: 0, padding: '14px 24px' }}>
            {loading ? '...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Inflow (Credit)</div>
          <div className="metric-value">
            {formatCurrency(data.metrics.inflow)}
            <ArrowUpRight size={24} color="var(--success)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Total Outflow (Debit)</div>
          <div className="metric-value">
            {formatCurrency(data.metrics.outflow)}
            <ArrowDownRight size={24} color="var(--error)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="metric-card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
          <div className="metric-title">Net Cashflow</div>
          <div className="metric-value">
            {formatCurrency(data.metrics.net)}
            <ArrowRightLeft size={24} color="var(--accent-1)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="chart-card">
          <div className="chart-title">Transaction Flow Over Time (Monthly)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.timeSeries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--error)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--error)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', backdropFilter: 'blur(10px)' }} 
                formatter={(value) => formatCurrency(value)}
              />
              <Legend verticalAlign="top" height={36} iconType="circle"/>
              <Line type="monotone" dataKey="Credit" stroke="var(--success)" strokeWidth={3} dot={{ stroke: 'var(--success)', strokeWidth: 2, fill: '#0f172a', r: 4 }} activeDot={{ r: 8, fill: 'var(--success)', stroke: '#fff' }} />
              <Line type="monotone" dataKey="Debit" stroke="var(--error)" strokeWidth={3} dot={{ stroke: 'var(--error)', strokeWidth: 2, fill: '#0f172a', r: 4 }} activeDot={{ r: 8, fill: 'var(--error)', stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Spending Breakdown (Debits)</div>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="rgba(0,0,0,0)"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }} 
                  formatter={(value) => formatCurrency(value)}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px'}}>No debit data available</div>
          )}
        </div>

        {/* New BarChart for Transaction Types */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title">Transaction Volume by Type</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <RechartsTooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }} 
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Cashflow;
