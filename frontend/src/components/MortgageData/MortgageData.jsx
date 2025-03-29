import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function MortgageData() {
    const [formData, setFormData] = useState({
        loan_amount: "",
        property_value: "",
        annual_income: "",
        debt_amount: "",
        loan_type: "",
        property_type: ""
    });
    const [mortgages, setMortgages] = useState([]);

    useEffect(() => {
        fetchMortgages();
    }, []);

    const fetchMortgages = async () => {
        try {
            const response = await axios.get("http://localhost:5000/mortgages");
            setMortgages(response.data);
        } catch (error) {
            console.error("Error fetching mortgages:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/add_mortgage", formData);
            fetchMortgages();
            setFormData({
                loan_amount: "",
                property_value: "",
                annual_income: "",
                debt_amount: "",
                loan_type: "",
                property_type: ""
            });
        } catch (error) {
            console.error("Error adding mortgage:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Mortgage Management System</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <label>Loan Amount</label>
                        <input type="number" name="loan_amount" className="form-control"
                               value={formData.loan_amount} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label>Property Value</label>
                        <input type="number" name="property_value" className="form-control"
                               value={formData.property_value} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label>Annual Income</label>
                        <input type="number" name="annual_income" className="form-control"
                               value={formData.annual_income} onChange={handleChange} required />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-4">
                        <label>Debt Amount</label>
                        <input type="number" name="debt_amount" className="form-control"
                               value={formData.debt_amount} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label>Loan Type</label>
                        <input type="text" name="loan_type" className="form-control"
                               value={formData.loan_type} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label>Property Type</label>
                        <input type="text" name="property_type" className="form-control"
                               value={formData.property_type} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Add Mortgage</button>
            </form>

            <h3>Existing Mortgages</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Credit Score</th>
                        <th>Loan Amount</th>
                        <th>Property Value</th>
                        <th>Annual Income</th>
                        <th>Debt Amount</th>
                        <th>Loan Type</th>
                        <th>Property Type</th>
                    </tr>
                </thead>
                <tbody>
                    {mortgages.map((mortgage) => (
                        <tr key={mortgage.id}>
                            <td>{mortgage.id}</td>
                            <td>{mortgage.credit_score}</td>
                            <td>{mortgage.loan_amount}</td>
                            <td>{mortgage.property_value}</td>
                            <td>{mortgage.annual_income}</td>
                            <td>{mortgage.debt_amount}</td>
                            <td>{mortgage.loan_type}</td>
                            <td>{mortgage.property_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MortgageData;
