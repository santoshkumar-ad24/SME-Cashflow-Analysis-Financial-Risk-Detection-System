import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { Target, Zap, Activity, Database, Settings2, ShieldCheck } from 'lucide-react';

const Home = () => {
  // Generate a mock ROC curve that roughly matches an AUC of 0.9292
  const generateROCCurve = () => {
    const data = [];
    for (let i = 0; i <= 100; i += 5) {
      const fpr = i / 100;
      // TPR = FPR^0.076 roughly gives 0.93 AUC
      const tpr = Math.pow(fpr, 0.076);
      data.push({
        fpr: fpr.toFixed(2),
        tpr: tpr.toFixed(2),
        baseline: fpr.toFixed(2)
      });
    }
    return data;
  };

  const rocData = generateROCCurve();

  const modelComparisonData = [
    { name: 'Logistic Reg', accuracy: 81.67, color: '#64748b' },
    { name: 'SVC', accuracy: 84.34, color: '#8b5cf6' },
    { name: 'XGBoost', accuracy: 85.18, color: '#0ea5e9' },
    { name: 'Random Forest', accuracy: 85.19, color: '#10b981' }
  ];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <Target size={40} color="var(--accent-1)" />
        <h1 style={{ margin: 0 }}>Model Analytics</h1>
      </div>
      <p className="subtitle">
        Performance metrics and architecture overview of the SME Financial Risk Assessment model. The model is trained on a comprehensive dataset to accurately predict loan defaults and financial instability.
      </p>

      {/* Top Metrics Grid */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="metric-card">
          <div className="metric-title"><Zap size={16} style={{ display: 'inline', marginRight: '6px' }}/> Winning Model</div>
          <div className="metric-value" style={{ fontSize: '1.8rem', color: 'var(--success)' }}>Random Forest</div>
        </div>
        <div className="metric-card">
          <div className="metric-title"><ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }}/> Test Accuracy</div>
          <div className="metric-value">85.19%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title"><Activity size={16} style={{ display: 'inline', marginRight: '6px' }}/> AUC Score</div>
          <div className="metric-value">0.9292</div>
        </div>
        <div className="metric-card">
          <div className="metric-title"><Database size={16} style={{ display: 'inline', marginRight: '6px' }}/> Total Trained Data</div>
          <div className="metric-value">50,000</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Model Comparison Chart */}
        <div className="chart-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="chart-title">Model Comparison (Test Accuracy)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[70, 90]} stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} width={90} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} />
              <RechartsTooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', backdropFilter: 'blur(10px)' }} 
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
              <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={32}>
                {modelComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROC Curve Chart */}
        <div className="chart-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="chart-title">ROC Curve (Random Forest)</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={rocData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="fpr" type="number" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} domain={[0, 1]} tickCount={6}>
                 <label value="False Positive Rate" position="insideBottom" offset={-15} fill="var(--text-secondary)" fontSize={12} />
              </XAxis>
              <YAxis type="number" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} axisLine={{stroke: 'rgba(255,255,255,0.1)'}} tickLine={false} domain={[0, 1]} tickCount={6}>
                 <label value="True Positive Rate" angle={-90} position="insideLeft" offset={10} fill="var(--text-secondary)" fontSize={12} />
              </YAxis>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
                labelFormatter={(label) => `FPR: ${label}`}
              />
              <Legend verticalAlign="top" height={36} iconType="plainline"/>
              <Area type="monotone" dataKey="tpr" name="ROC Curve (AUC=0.9292)" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorTpr)" />
              <Area type="linear" dataKey="baseline" name="Random Guess" stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Parameters & Feature Engineering */}
      <div className="form-section fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="form-title"><Settings2 size={24} style={{ marginRight: '10px', color: 'var(--accent-1)' }}/> Architecture & Parameters</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <h3 style={{ color: 'var(--accent-2)', marginTop: 0 }}>Random Forest Configuration</h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', listStyleType: 'square', paddingLeft: '20px' }}>
              <li><strong>n_estimators:</strong> 200 (Number of trees in the forest)</li>
              <li><strong>class_weight:</strong> 'balanced' (Addresses class imbalance in defaults)</li>
              <li><strong>random_state:</strong> 42 (For reproducible splits)</li>
              <li><strong>Precision:</strong> 0.85 (Class 1)</li>
              <li><strong>Recall:</strong> 0.88 (Class 1)</li>
              <li><strong>F1-Score:</strong> 0.86 (Class 1)</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--purple)', marginTop: 0 }}>Feature Engineering Pipeline</h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', listStyleType: 'square', paddingLeft: '20px' }}>
              <li><strong>Scaling:</strong> StandardScaler applied to continuous variables (Income, Debt, Assets)</li>
              <li><strong>Categorical Encoding:</strong> One-Hot Encoding for transaction channels and risk categories</li>
              <li><strong>Missing Values:</strong> Median imputation for numerical, mode for categorical</li>
              <li><strong>Derived Features:</strong> Debt-to-Income Ratio, Asset Utilization Ratio</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
