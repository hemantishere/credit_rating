from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Mortgage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    credit_score = db.Column(db.Integer, nullable=False)
    loan_amount = db.Column(db.Float, nullable=False)
    property_value = db.Column(db.Float, nullable=False)
    annual_income = db.Column(db.Float, nullable=False)
    debt_amount = db.Column(db.Float, nullable=False)
    loan_type = db.Column(db.Enum("fixed", "adjustable"), nullable=False)
    property_type = db.Column(db.Enum("single_family", "condo"), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)  # Changed to Integer for numeric score
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())