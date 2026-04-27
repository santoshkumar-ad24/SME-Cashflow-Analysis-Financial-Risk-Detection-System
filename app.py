import streamlit as st
from eda_app import render_eda
from cashflow_app import render_cashflow
from predictor_app import render_predictor

# Set page config
st.set_page_config(page_title="Financial Risk Detection", page_icon="💸", layout="wide")

# Custom CSS for rich aesthetics
st.markdown("""
<style>
    .main { background-color: #0f111a; color: #f8fafc; }
    .stApp { background-color: #0f111a; }
    /* Override specific texts to light */
    h1, h2, h3, p, span, label { color: #f8fafc !important; }
    
    /* Sidebar */
    [data-testid="stSidebar"] { background-color: #1e293b !important; }
    
    /* Metrics */
    div[data-testid="stMetricValue"] {
        background: linear-gradient(90deg, #818cf8, #c084fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }
    
    /* Submit button */
    [data-testid="stFormSubmitButton"] > button {
        background: linear-gradient(90deg, #6366f1, #a855f7);
        color: white !important;
        border: none;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    [data-testid="stFormSubmitButton"] > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
    }
    
    /* Input fields background */
    .stTextInput>div>div>input, .stNumberInput>div>div>input {
        background-color: rgba(30, 41, 59, 0.8) !important;
        color: #f8fafc !important;
    }
    
    /* Hide some default Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.markdown("<h2>💸 FinTech SME</h2>", unsafe_allow_html=True)
st.sidebar.markdown("---")
page = st.sidebar.radio("Navigation", ["📊 Financial Risk Analysis", "💰 Cashflow Analysis", "🤖 AI Risk Predictor"])

# Render corresponding module based on selection
if page == "📊 Financial Risk Analysis":
    render_eda()
elif page == "💰 Cashflow Analysis":
    render_cashflow()
elif page == "🤖 AI Risk Predictor":
    render_predictor()
