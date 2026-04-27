# 💼 SME Cashflow Analysis & Financial Risk Detection System

## 📌 Overview

This project is an AI-powered system designed to analyze SME (Small and Medium Enterprises) financial behavior and detect financial risk using supervised learning techniques. It combines machine learning with transaction-based cashflow analysis to support better financial decision-making.

---

## 🎯 Objectives

* Analyze SME cashflow using transaction data
* Detect financial risk using machine learning
* Provide insights for safer lending decisions
* Build an interactive dashboard using Streamlit

---

## 🧠 Key Features

### ⚠️ Financial Risk Detection Engine

* Uses **Support Vector Classifier (SVC)**
* Classifies users into:

  * 🟢 Low Risk
  * 🟡 Medium Risk
  * 🔴 High Risk
* Provides probability-based predictions
* Includes basic explainability (key risk factors)

---


## 📂 Datasets Used

### 1. Loan Approval Dataset (`Loan_approval_data_2025.csv`)
* Used for training the loan prediction model and EDA
* Features: credit_score, annual_income, current_debt, credit_history_years, defaults_on_file, delinquencies_last_2yrs, debt_to_income_ratio, loan_status (target)

### 2. Bank Transactions Dataset (`bank_transactions_data.csv`)
* Used for cashflow analysis
* Features: TransactionAmount, TransactionDate, TransactionType, AccountBalance

---

## ⚙️ Feature Engineering

Key engineered features include:

* **credit_risk_score** → combines defaults, delinquencies, derogatory marks
* **stability_score** → income vs debt capability
* **debt_burden** → normalized debt level
* Removal of redundant features to avoid multicollinearity

---

## 🤖 Machine Learning

* Models Tested:

  * Logistic Regression
  * SVM (SVC)
  * Random Forest
  * XGBoost

* ✅ Final Model: **Random Forest**

---

## 📈 Results

* Achieved high accuracy with strong feature selection
* Identified key risk indicators:

  * Credit Score
  * Debt-to-Income Ratio
  * Credit Risk Score

---

## 🖥️ Application Structure

The app is modular with three main pages:

### 🔹 EDA Page
* Interactive visualizations of financial data
* Key metrics and distributions

### 🔹 Cashflow Page
* Transaction analysis dashboard
* Filters and trend visualizations

### 🔹 Predictor Page
* Loan approval prediction form
* Real-time model inference

---

## 🏗️ Project Structure

```
ml_project_final_sme/
│
├── app.py                          # Main application entry point
├── eda_app.py                      # EDA module
├── cashflow_app.py                 # Cashflow analysis module
├── predictor_app.py                # Loan prediction module
│
├── datasets/
│   ├── Loan_approval_data_2025.csv
│   └── bank_transactions_data.csv
│
├── model_training/
│   └── sme_financial_model.ipynb   # Jupyter notebook for model training
│
├── model/                          # (Created after training)
│   └── loanApproved_model.pkl
│
├── README.md
└── __pycache__/
```

---

## 🚀 How to Run

```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 🎤 Key Insight

> This project goes beyond traditional loan prediction by analyzing financial behavior and detecting risk using AI-driven insights.

---

## ⚠️ Limitations

* Uses static datasets (not real-time)
* Simplified financial assumptions
* Model performance depends on data quality

---

## 🔮 Future Improvements

* Real-time banking integration
* Advanced explainability (SHAP)
* Time-series cashflow forecasting
* Enhanced UI/UX dashboard

---

## 🏆 Conclusion

This project demonstrates how machine learning and financial analytics can be combined to build a practical financial risk detection system. It provides a scalable foundation for fintech applications focused on SME lending and risk assessment.

---
