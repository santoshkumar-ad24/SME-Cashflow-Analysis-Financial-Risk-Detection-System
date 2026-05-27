# SME Cashflow Analysis & Financial Risk Detection System

## 🚀 Overview
The **SME Financial Risk Detection System** is an enterprise-grade web application designed to analyze company cash flow, assess financial health, and accurately predict loan approval risks. 

Originally built as a monolithic Streamlit application, the system has been entirely refactored into a modern, highly scalable **React + Flask + MongoDB** architecture. It is designed to service both small-to-medium enterprises (SMEs) and multi-billion-dollar multinational corporations using an intelligent Random Forest Machine Learning model.

## 🌟 Key Features

1. **MERN-Style Architecture (React + Flask + MongoDB)**
   - A highly responsive Single Page Application (SPA) built with React and Vite.
   - A robust Python Flask backend REST API handling all mathematical modeling and machine learning inference.
   - Historical financial dataset storage migrated to a NoSQL **MongoDB** database for rapid querying.

2. **Annual Report Analysis (AI-Powered)**
   - Users can drag and drop raw corporate annual reports (`.pdf` or `.csv`).
   - The system utilizes `PyPDF2` and custom Regular Expressions to intelligently parse financial metrics directly from text, automatically recognizing magnitude strings (e.g., "Revenue: 2.5 million", "Debt: $1B").
   - Extracted data instantly populates an advanced stock-trading-style dashboard featuring 5 key visualizations (Recharts):
     - Quarterly Revenue & Net Income Trend (Line Chart)
     - Estimated Revenue Breakdown (Pie Chart)
     - Balance Sheet Summary (Pie Chart)
     - Profitability Analysis (Bar Chart)
     - Cash Flow Statement Summary (Bar Chart)

3. **Enterprise Machine Learning Normalization**
   - The core AI model (`RandomForestClassifier`) evaluates loan applicants based on Stability Score, Debt-to-Income Ratio, and Credit History.
   - **Corporate Asset-Backing Adjustment:** Because the model was trained on SME data, the backend features a specialized "normalization layer." If a massive enterprise report (e.g., $75 Million revenue) is processed, the API dynamically discounts asset-backed corporate debt and mathematically scales the data down to the ML model's baseline, guaranteeing flawless risk predictions across all company sizes without breaking the model's bounds.

4. **Professional UI/UX Design System**
   - Clean, state-of-the-art "White and Cyan" aesthetic utilizing deep shadows, glassmorphism, and dynamic hover animations.
   - Fully responsive grid layouts tailored for modern web analytics.

## 🛠️ Technology Stack

**Frontend:**
- **React.js** (via Vite)
- **React Router** (Client-side routing)
- **Recharts** (Enterprise Data Visualization)
- **Lucide React** (Vector Iconography)
- **Axios** (API communication)
- **Vanilla CSS** (Custom Design System)

**Backend:**
- **Python 3.x**
- **Flask** & **Flask-CORS** (RESTful API Server)
- **Pandas** & **NumPy** (Data processing and Feature Engineering)
- **Scikit-Learn** & **Joblib** (Machine Learning Model Inference)
- **PyPDF2** (PDF Document Parsing)
- **PyMongo** (MongoDB Database connector)

**Database:**
- **MongoDB** (Local instance: `mongodb://localhost:27017/`)

## 📁 Project Structure

```text
ml_project_final_sme-fwd/
│
├── backend/
│   ├── app.py                  # Main Flask API Server
│   └── models/                 # Serialized ML Models (.pkl)
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React UI Components
│   │   ├── pages/              # Main Views (Dashboard, ReportAnalysis, Cashflow)
│   │   ├── App.jsx             # React Router Configuration
│   │   └── index.css           # Global Design System Variables
│   ├── package.json
│   └── vite.config.js
│
├── datasets/                   # Raw historical CSV data
├── migrate_to_mongo.py         # ETL script for migrating CSVs to MongoDB
└── README.md                   # Project Documentation
```

## ⚙️ Installation & Setup

### 1. Database Setup
Ensure you have **MongoDB Community Server** installed and running locally on port `27017`.
To migrate the historical `.csv` datasets into MongoDB, run:
```bash
python migrate_to_mongo.py
```

### 2. Backend Setup
Navigate to the `backend` directory, install the Python dependencies, and start the Flask server:
```bash
cd backend
pip install flask flask-cors pandas scikit-learn joblib pymongo pypdf2
python app.py
```
*The server will start on `http://localhost:5000`.*

### 3. Frontend Setup
Navigate to the `frontend` directory, install the Node modules, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
*The application will launch on `http://localhost:5173/`.*

## 📈 Usage Workflow
1. Navigate to the **Annual Report Analysis** tab.
2. Upload a sample corporate financial PDF (e.g., an IFRS USD Earnings Release).
3. Watch as the intelligent parsing engine automatically builds the financial charts.
4. Input any missing credit metrics (e.g., specific delinquencies).
5. Click **Predict Risk** to process the data through the Machine Learning Normalization Layer and view the final AI Approval Probability.
