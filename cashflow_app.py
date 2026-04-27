import streamlit as st
import pandas as pd
import plotly.express as px

@st.cache_data
def load_transaction_data():
    df = pd.read_csv("datasets/bank_transactions_data.csv")
    df['TransactionDate'] = pd.to_datetime(df['TransactionDate'], errors='coerce')
    return df

def render_cashflow():
    st.title("Cashflow Analysis Dashboard")
    st.write("Deep dive into SME transactions. Use filters to identify specific spending patterns and cashflow stability.")
    
    with st.spinner("Processing massive transactions data..."):
        df = load_transaction_data()
        
    if df.empty:
        st.error("Transaction data could not be loaded.")
    else:
        # Filters
        st.markdown("#### Dynamic Filters")
        f_col1, f_col2, f_col3 = st.columns(3)
        with f_col1:
            min_date = df['TransactionDate'].min().date()
            max_date = df['TransactionDate'].max().date()
            date_range = st.date_input("Date Range", [min_date, max_date], min_value=min_date, max_value=max_date)
        with f_col2:
            channels = ['All'] + sorted(list(df['Channel'].dropna().unique()))
            selected_channel = st.selectbox("Transaction Channel", channels)
        with f_col3:
            txn_types = ['All'] + sorted(list(df['TransactionType'].dropna().unique()))
            selected_type = st.selectbox("Transaction Type", txn_types)
            
        # Apply filters
        filtered_df = df.copy()
        if len(date_range) == 2:
            filtered_df = filtered_df[(filtered_df['TransactionDate'].dt.date >= date_range[0]) & (filtered_df['TransactionDate'].dt.date <= date_range[1])]
        if selected_channel != 'All':
            filtered_df = filtered_df[filtered_df['Channel'] == selected_channel]
        if selected_type != 'All':
            filtered_df = filtered_df[filtered_df['TransactionType'] == selected_type]
            
        st.markdown("---")
        
        # Metrics
        inflow = filtered_df[filtered_df['TransactionType'] == 'Credit']['TransactionAmount'].sum()
        outflow = filtered_df[filtered_df['TransactionType'] == 'Debit']['TransactionAmount'].sum()
        net = inflow - outflow
        
        m_col1, m_col2, m_col3 = st.columns(3)
        m_col1.metric("🟢 Total Inflow (Credit)", f"${inflow:,.2f}")
        m_col2.metric("🔴 Total Outflow (Debit)", f"${outflow:,.2f}")
        m_col3.metric("🔵 Net Cashflow", f"${net:,.2f}")
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        if not filtered_df.empty:
            c_col1, c_col2 = st.columns([2, 1])
            
            with c_col1:
                # Timeline
                timeline_df = filtered_df.copy()
                if len(date_range) == 2 and (date_range[1] - date_range[0]).days <= 60:
                    timeline_df['Period'] = timeline_df['TransactionDate'].dt.to_period('D').astype(str)
                else:
                    timeline_df['Period'] = timeline_df['TransactionDate'].dt.to_period('M').astype(str)
                    
                period_flow = timeline_df.groupby(['Period', 'TransactionType'])['TransactionAmount'].sum().reset_index()
                period_flow = period_flow.sort_values('Period')
                fig_time = px.line(period_flow, x='Period', y='TransactionAmount', color='TransactionType', 
                                   title="Transaction Flow Over Time", color_discrete_map={'Credit': '#2dd4bf', 'Debit': '#ef4444'})
                fig_time.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                                       margin=dict(t=40, b=0, l=0, r=0))
                st.plotly_chart(fig_time, use_container_width=True)
                
            with c_col2:
                # Doughnut chart for channels
                channel_spending = filtered_df[filtered_df['TransactionType'] == 'Debit'].groupby('Channel')['TransactionAmount'].sum().reset_index()
                if not channel_spending.empty:
                    fig_channel = px.pie(channel_spending, names='Channel', values='TransactionAmount', hole=0.4, 
                                         title="Spending by Channel (Debits)",
                                         color_discrete_sequence=['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'])
                    fig_channel.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='#f8fafc',
                                              margin=dict(t=40, b=0, l=0, r=0), showlegend=True, legend=dict(orientation="h", y=-0.2))
                    st.plotly_chart(fig_channel, use_container_width=True)
        else:
            st.info("No data available for the selected filters.")
