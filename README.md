# 💸 FinTech SME: Intelligent Financial Risk & Cashflow Assessment System

![UI/UX Theme](https://img.shields.io/badge/UI%2FUX-Dark%20Glassmorphism-06b6d4?style=flat-square)
![Machine Learning](https://img.shields.io/badge/ML%20Model-Random%20Forest%20(85.2%25)-10b981?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Flask-3b82f6?style=flat-square)

FinTech SME is an industrial-grade, full-stack financial analytics platform designed to evaluate Small and Medium-sized Enterprises (SMEs) for credit risk, loan eligibility, and financial health. By combining advanced Machine Learning algorithms with a stunning, highly interactive dashboard, the system empowers financial analysts and loan officers to make data-driven, confident decisions instantly.

---

## ✨ Key Features

- **🧠 AI Risk Predictor:** Enter an applicant's financial and credit metrics to instantly calculate an approval confidence score using a pre-trained Random Forest model (85.19% Accuracy, 0.93 AUC).
- **📄 Automated Annual Report Analysis:** Drag-and-drop PDF or CSV annual reports to automatically extract key financial data (NLP) and visualize the enterprise's health against safe industry benchmarks via Radar and Correlation charts.
- **💰 Cashflow Analytics Dashboard:** Deep-dive into massive transaction datasets with interactive Time-Series, Pie, and Bar charts to identify spending patterns and liquidity trends.
- **📊 Model Analytics Engine:** Transparently view model performance, ROC curves, feature engineering pipelines, and comparisons across various ML models (XGBoost, SVC, Logistic Regression).
- **🎨 Premium UI/UX:** Features a dynamic Light/Dark mode toggle, custom glassmorphism aesthetics, fluid micro-animations, and responsive layouts.

---

## 🎯 Use Case Scenarios

### Scenario 1: Instant Loan Origination Decisioning
> **The Problem:** A loan officer receives a credit application from a local SME. Manually cross-referencing income, debt, and derogatory marks takes hours and is prone to human bias.
> 
> **The Solution:** The officer uses the **AI Risk Predictor**. By inputting the SME's metrics, the Random Forest model instantly categorizes the application as *Low, Medium, or High Risk*, providing a precise "Approval Confidence" percentage via a dynamic gauge chart.

### Scenario 2: Rapid Enterprise Health Audits
> **The Problem:** A financial analyst is tasked with reviewing a 50-page annual report to determine an enterprise's quarter-over-quarter growth and asset backing.
> 
> **The Solution:** The analyst uploads the document to the **Annual Report Analysis** dashboard. The system extracts net income, total assets, and cash flow data, immediately generating a Radar Chart that visually compares the SME against safe industry benchmarks.

### Scenario 3: Fraud & Anomaly Detection in Cashflow
> **The Problem:** A risk manager needs to ensure an SME isn't misusing funds or experiencing hidden liquidity crunches before approving a credit line extension.
> 
> **The Solution:** Using the **Cashflow** tab, the manager filters transactions by date and channel. Visualizing the data reveals anomalous spikes in B2B transfers or unexpected net cashflow deficits, prompting a closer review.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client-Side)
- **Framework:** React.js (Vite)
- **Routing:** React Router v6
- **Data Visualization:** Recharts (Area, Bar, Pie, Radar, Scatter)
- **Styling:** Vanilla CSS (CSS Variables, Glassmorphism, Custom Light/Dark themes)
- **Icons:** Lucide React

### Backend (Server-Side / ML)
- **Framework:** Flask (Python) / RESTful API
- **Machine Learning:** Scikit-Learn, Pandas, NumPy
- **Winning Model:** Random Forest (`n_estimators=200`, `class_weight='balanced'`)

---

## 🔒 Security & Configuration (Best Practices)

To maintain the security and integrity of the system, all sensitive configurations are hidden from the source code. **Never commit your `.env` files to version control.**

1. **Environment Variables:**
   Create a `.env` file in your `backend/` directory for sensitive credentials:
   ```env
   # Example .env (Backend)
   FLASK_ENV=development
   SECRET_KEY=your_secure_random_key_here
   DATABASE_URI=postgresql://user:password@localhost:5432/sme_db
   API_BEARER_TOKEN=your_auth_token
   ```
2. **Frontend API Configuration:**
   Ensure your frontend `.env` points to the correct backend origin to prevent CORS vulnerabilities:
   ```env
   # Example .env (Frontend)
   VITE_API_URL=http://localhost:5000/api
   ```
3. **Data Privacy:** Any uploaded PDF/CSV reports containing PII (Personally Identifiable Information) or sensitive corporate financials are processed in-memory or in ephemeral storage and should be configured to wipe automatically after extraction.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Setup the Backend
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the Flask Server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 2. Setup the Frontend
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install

# Start the Vite Development Server
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

---

## 🧠 Model Training Details
The core Machine Learning model was trained on a highly imbalanced dataset of 50,000 SME records. 
- **Preprocessing:** Features were scaled using `StandardScaler` and categorical variables were One-Hot Encoded.
- **Selection:** We evaluated Logistic Regression, Support Vector Classifier (SVC), XGBoost, and Random Forest.
- **Result:** Random Forest emerged as the winner, achieving an **85.19% Test Accuracy** and an impressive **AUC Score of 0.9292**, largely due to its ability to handle non-linear boundaries and class imbalances (`class_weight='balanced'`).

---
*Developed for intelligent, data-driven financial analytics.*
