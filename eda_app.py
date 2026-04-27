import streamlit as st
import pandas as pd
import plotly.express as px

@st.cache_data
def load_loan_data():
    return pd.read_csv("datasets/Loan_approval_data_2025.csv")

def render_eda():
    st.title("Financial Risk Analysis")
    st.write("Exploratory Data Analysis of the 2025 financial dataset to understand risk indicators.")
    
    # Load data
    with st.spinner("Loading dataset..."):
        df = load_loan_data()
        # Map loan_status to strings for better visualizations
        df['Status_Label'] = df['loan_status'].map({1: 'Approved', 0: 'Rejected'})
    
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Applications", f"{len(df):,}")
    
    approved = len(df[df['loan_status'] == 1])
    rate = (approved / len(df)) * 100
    col2.metric("Overall Approval Rate", f"{rate:.1f}%")
    
    avg_income = df['annual_income'].mean()
    col3.metric("Average Annual Income", f"${avg_income:,.0f}")
    
    st.markdown("---")
    
    col_a, col_b = st.columns(2)
    
    with col_a:
        # Status distribution
        status_counts = df['Status_Label'].value_counts().reset_index()
        status_counts.columns = ['Status', 'Count']
        fig1 = px.pie(status_counts, names='Status', values='Count', hole=0.4, title="Loan Approval Distribution", 
                      color_discrete_sequence=['#2dd4bf', '#ef4444'])
        fig1.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                           margin=dict(t=40, b=0, l=0, r=0))
        st.plotly_chart(fig1, use_container_width=True)
        
    with col_b:
        # Credit Score vs Status
        fig2 = px.box(df, y="credit_score", x="Status_Label", color="Status_Label", title="Credit Score by Loan Status", 
                      color_discrete_sequence=['#2dd4bf', '#ef4444'])
        fig2.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                           margin=dict(t=40, b=0, l=0, r=0))
        st.plotly_chart(fig2, use_container_width=True)

    st.markdown("<br>", unsafe_allow_html=True)
    
    col_c, col_d = st.columns(2)
    
    with col_c:
        # Years Employed
        fig3 = px.histogram(df, x="years_employed", color="Status_Label", barmode='overlay', title="Years Employed Distribution",
                            color_discrete_sequence=['#2dd4bf', '#ef4444'])
        fig3.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                           margin=dict(t=40, b=0, l=0, r=0))
        st.plotly_chart(fig3, use_container_width=True)
        
    with col_d:
        # Debt vs Income
        fig4 = px.scatter(df.sample(n=min(5000, len(df))), x="annual_income", y="current_debt", color="Status_Label", opacity=0.6, 
                          title="Current Debt vs Annual Income (Sample)", color_discrete_sequence=['#2dd4bf', '#ef4444'])
        fig4.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                           margin=dict(t=40, b=0, l=0, r=0))
        st.plotly_chart(fig4, use_container_width=True)
