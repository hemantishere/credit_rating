CREATE DATABASE IF NOT EXISTS mortgage_db;
USE mortgage_db;

CREATE TABLE IF NOT EXISTS mortgages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    credit_score INT NOT NULL,
    loan_amount FLOAT NOT NULL,
    property_value FLOAT NOT NULL,
    annual_income FLOAT NOT NULL,
    debt_amount FLOAT NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    property_type VARCHAR(50) NOT NULL
);
