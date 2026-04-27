import streamlit as st
import pandas as pd
import joblib

@st.cache_resource
def load_model():
    try:
        model = joblib.load("model/loanApproved_model.pkl") #loading model
        return model
    except Exception as e:
        return None

def render_predictor():
    st.title("Financial Risk Predictor")
    st.write("Enter the applicant's financial and credit details. The AI model will predict the likelihood of loan approval based on their risk profile.")
    
    model = load_model()
    
    if model is None:
        st.error("Error: Could not load the Random Forest model. Please ensure `model/loanApproved_model.pkl` exists.")
    else:
        with st.form("risk_form"):
            st.subheader("Personal & Financial Information")
            col1, col2, col3 = st.columns(3)
            with col1:
                annual_income = st.number_input("Annual Income ($)", min_value=1000.0, value=65000.0, step=1000.0)
            with col2:
                years_employed = st.number_input("Years Employed", min_value=0.0, max_value=50.0, value=5.0, step=1.0)
            with col3:
                current_debt = st.number_input("Current Debt ($)", min_value=0.0, value=15000.0, step=1000.0)
                
            st.subheader("Credit Profile")
            col4, col5 = st.columns(2)
            with col4:
                credit_score = st.number_input("Credit Score", min_value=300.0, max_value=850.0, value=650.0, step=10.0)
            with col5:
                credit_history_years = st.number_input("Credit History (Years)", min_value=0.0, max_value=50.0, value=7.0, step=1.0)
                
            st.subheader("Risk Indicators")
            col6, col7, col8 = st.columns(3)
            with col6:
                defaults_on_file = st.number_input("Defaults on File", min_value=0, max_value=10, value=0, step=1)
            with col7:
                delinquencies = st.number_input("Delinquencies (Last 2 Yrs)", min_value=0, max_value=20, value=0, step=1)
            with col8:
                derogatory_marks = st.number_input("Derogatory Marks", min_value=0, max_value=20, value=0, step=1)
                
            submit = st.form_submit_button("Run Risk Analysis")
            
        if submit:
            with st.spinner("Analyzing risk profile using AI..."):
                try:
                    # Feature Engineering to match the new Random Forest model
                    credit_risk_score = defaults_on_file + delinquencies + derogatory_marks
                    stability_score = annual_income / (current_debt + 1)
                    debt_to_income_ratio = current_debt / (annual_income + 1)
                    
                    # Expected order: ['credit_score', 'credit_risk_score', 'debt_to_income_ratio', 
                    #                  'credit_history_years', 'years_employed', 'annual_income', 'stability_score']
                    features = pd.DataFrame([[
                        credit_score, 
                        credit_risk_score, 
                        debt_to_income_ratio, 
                        credit_history_years, 
                        years_employed, 
                        annual_income, 
                        stability_score
                    ]], columns=[
                        'credit_score', 'credit_risk_score', 'debt_to_income_ratio', 
                        'credit_history_years', 'years_employed', 'annual_income', 'stability_score'
                    ])
                    
                    # Predict directly (no scaling required for this RF model)
                    prediction = model.predict(features)[0]
                    
                    try:
                        prob = model.predict_proba(features)[0]
                        confidence = prob[1] * 100
                    except:
                        confidence = 100.0 if prediction == 1 else 0.0
                    
                    st.markdown("---")
                    res_col1, res_col2 = st.columns([1, 2])
                    
                    if prediction == 1:
                        res_col1.success("### 🎉 Approved")
                        res_col2.info(f"**Approval Confidence:** {confidence:.1f}%")
                        st.progress(confidence / 100.0)
                        st.write("The model categorizes this profile as **Low Risk**. The application meets approval criteria based on strong stability and credit metrics.")
                    else:
                        res_col1.error("### ⚠️ Rejected")
                        res_col2.warning(f"**Approval Likelihood:** {confidence:.1f}%")
                        st.progress(confidence / 100.0)
                        st.write("The model categorizes this profile as **High Risk**. The application is likely to be rejected due to high debt-to-income or derogatory marks.")
                        
                except Exception as e:
                    st.error(f"An error occurred during prediction: {e}")
