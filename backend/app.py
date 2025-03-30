from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Mortgage
from credit_rating import calculate_credit_rating, calculate_rmbs_rating, get_rating_from_score
from dotenv import load_dotenv
import os
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

logging.basicConfig(
    level=logging.getLevelName(os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(os.getenv("LOG_FILE", "app.log")), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

with app.app_context():
    db.create_all()

@app.route("/add_mortgage", methods=["POST"])
def add_mortgage():
    data = request.get_json()
    if not all(key in data for key in ["credit_score", "loan_amount", "property_value", "annual_income", "debt_amount", "loan_type", "property_type"]):
        logger.error("Missing required fields in mortgage data")
        return jsonify({"error": "All fields are required"}), 400
    
    risk_score = calculate_credit_rating(data)
    rating = get_rating_from_score(risk_score)
    try:
        new_mortgage = Mortgage(
            credit_score=data["credit_score"],
            loan_amount=data["loan_amount"],
            property_value=data["property_value"],
            annual_income=data["annual_income"],
            debt_amount=data["debt_amount"],
            loan_type=data["loan_type"],
            property_type=data["property_type"],
            risk_score=risk_score
        )
        db.session.add(new_mortgage)
        db.session.commit()
        logger.info(f"New mortgage added with ID: {new_mortgage.id}, Risk Score: {risk_score}, Rating: {rating}")
        return jsonify({"message": "Mortgage added successfully", "id": new_mortgage.id, "risk_score": risk_score, "rating": rating}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding mortgage: {str(e)}")
        return jsonify({"error": f"Failed to add mortgage: {str(e)}"}), 500

@app.route("/mortgages", methods=["GET"])
def get_mortgages():
    try:
        mortgages = Mortgage.query.all()
        mortgage_list = [{
            "id": m.id, "credit_score": m.credit_score, "loan_amount": m.loan_amount,
            "property_value": m.property_value, "annual_income": m.annual_income,
            "debt_amount": m.debt_amount, "loan_type": m.loan_type, "property_type": m.property_type,
            "risk_score": m.risk_score, "rating": get_rating_from_score(m.risk_score)
        } for m in mortgages]
        logger.info(f"Retrieved {len(mortgage_list)} mortgages")
        return jsonify(mortgage_list), 200
    except Exception as e:
        logger.error(f"Error fetching mortgages: {str(e)}")
        return jsonify({"error": "Failed to retrieve mortgages"}), 500

@app.route("/update_mortgage/<int:mortgage_id>", methods=["PUT"])
def update_mortgage(mortgage_id):
    data = request.get_json()
    if not all(key in data for key in ["credit_score", "loan_amount", "property_value", "annual_income", "debt_amount", "loan_type", "property_type"]):
        logger.error(f"Missing required fields in update request for mortgage ID: {mortgage_id}")
        return jsonify({"error": "All fields are required"}), 400
    
    risk_score = calculate_credit_rating(data)
    rating = get_rating_from_score(risk_score)
    try:
        mortgage = Mortgage.query.get(mortgage_id)
        if not mortgage:
            logger.warning(f"Mortgage ID {mortgage_id} not found")
            return jsonify({"error": "Mortgage not found"}), 404
        
        mortgage.credit_score = data["credit_score"]
        mortgage.loan_amount = data["loan_amount"]
        mortgage.property_value = data["property_value"]
        mortgage.annual_income = data["annual_income"]
        mortgage.debt_amount = data["debt_amount"]
        mortgage.loan_type = data["loan_type"]
        mortgage.property_type = data["property_type"]
        mortgage.risk_score = risk_score
        
        db.session.commit()
        logger.info(f"Updated mortgage ID: {mortgage.id}, New Risk Score: {risk_score}, Rating: {rating}")
        return jsonify({"message": "Mortgage updated successfully", "risk_score": risk_score, "rating": rating}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating mortgage ID {mortgage_id}: {str(e)}")
        return jsonify({"error": f"Failed to update mortgage: {str(e)}"}), 500

@app.route("/delete_mortgage/<int:mortgage_id>", methods=["DELETE"])
def delete_mortgage(mortgage_id):
    try:
        mortgage = Mortgage.query.get(mortgage_id)
        if not mortgage:
            logger.warning(f"Mortgage ID {mortgage_id} not found")
            return jsonify({"error": "Mortgage not found"}), 404
        
        db.session.delete(mortgage)
        db.session.commit()
        logger.info(f"Deleted mortgage ID: {mortgage_id}")
        return jsonify({"message": "Mortgage deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting mortgage ID {mortgage_id}: {str(e)}")
        return jsonify({"error": f"Failed to delete mortgage: {str(e)}"}), 500

@app.route("/get_rmbs_rating", methods=["GET"])  # Renamed to avoid conflict
def get_rmbs_rating():
    try:
        mortgages = Mortgage.query.all()
        if not mortgages:
            logger.info("No mortgages available for RMBS rating calculation")
            return jsonify({"rating": "N/A", "message": "No mortgages available"}), 200
        
        mortgage_data = [{
            "credit_score": m.credit_score, "loan_amount": m.loan_amount,
            "property_value": m.property_value, "annual_income": m.annual_income,
            "debt_amount": m.debt_amount, "loan_type": m.loan_type, "property_type": m.property_type
        } for m in mortgages]
        rmbs_rating = calculate_rmbs_rating(mortgage_data)
        logger.info(f"Calculated RMBS rating: {rmbs_rating}")
        return jsonify({"rating": rmbs_rating}), 200
    except Exception as e:
        logger.error(f"Error calculating RMBS rating: {str(e)}")
        return jsonify({"error": "Failed to calculate RMBS rating"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)