# RMBS Credit Rating System

## Project Overview
This project is a full-stack application designed to calculate the credit rating of Residential Mortgage-Backed Securities (RMBS). It allows users to input mortgage data, calculate individual mortgage credit ratings, and determine an overall RMBS rating based on predefined business rules. The application consists of a React frontend, a Flask backend, and a MySQL database.

### Features
- **Frontend**: A user-friendly React interface to add, edit, delete, and view mortgages, with real-time RMBS rating updates.
- **Backend**: A Flask API to handle mortgage data, calculate credit ratings, and manage database operations.
- **Database**: MySQL to store mortgage data.
- **Credit Rating Algorithm**: Calculates individual mortgage ratings (AAA, BBB, C) and an overall RMBS rating based on business rules.
- **Logging**: Comprehensive logging for debugging and monitoring.

## Project Structure

credit_rating/
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── MortgageData.jsx  # Main component for mortgage management
│   │   └── App.jsx             # Root React component
│   ├── public/
│   └── package.json            # Frontend dependencies
│
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── credit_rating.py       # Business logic for credit rating calculations
│   ├── models.py              # Database models (SQLAlchemy)
│   └── requirements.txt       # Backend dependencies
│
├── database/
│   └── schema.sql             # SQL script for creating the database schema
│
└── README.md                  # Project documentation



## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Python 3.8+**: For the Flask backend.
- **Node.js 16+ and npm**: For the React frontend.
- **MySQL 8.0+**: For the database.
- **Git**: To clone the repository.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd credit_rating


2. Backend Setup
Navigate to the Backend Directory
cd backend
pip install -r requirements.txt

Set Up MySQL Database:
Start your MySQL server.
Create a database named mortgage_db

Run the Backend
python app.py
The Flask server will start on http://localhost:5000.

3. Frontend Setup
npm install
npm start
The React app will start on http://localhost:3000.

4. Access the Application
Open your browser and navigate to http://localhost:3000.
You should see the "Add New Mortgage" form, an RMBS rating display, and a table of mortgages (if any exist).

