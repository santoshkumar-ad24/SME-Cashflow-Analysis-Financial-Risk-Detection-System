import pandas as pd
from pymongo import MongoClient

def migrate_data():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["sme_financial_db"]
    
    # 1. Loan Approval Data
    print("Migrating Loan Approval Data...")
    try:
        loan_df = pd.read_csv("datasets/Loan_approval_data_2025.csv")
        loan_records = loan_df.to_dict(orient="records")
        if "loan_applications" in db.list_collection_names():
            db["loan_applications"].drop()
        db["loan_applications"].insert_many(loan_records)
        print(f"Successfully inserted {len(loan_records)} loan applications.")
    except Exception as e:
        print(f"Error migrating loan data: {e}")
        
    # 2. Bank Transactions Data
    print("Migrating Bank Transactions Data...")
    try:
        txn_df = pd.read_csv("datasets/bank_transactions_data.csv")
        txn_records = txn_df.to_dict(orient="records")
        if "transactions" in db.list_collection_names():
            db["transactions"].drop()
        db["transactions"].insert_many(txn_records)
        print(f"Successfully inserted {len(txn_records)} transactions.")
    except Exception as e:
        print(f"Error migrating transaction data: {e}")

if __name__ == "__main__":
    migrate_data()
