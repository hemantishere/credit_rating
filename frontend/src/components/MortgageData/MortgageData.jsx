import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function MortgageData() {
    const [formData, setFormData] = useState({
        credit_score: "",
        loan_amount: "",
        property_value: "",
        annual_income: "",
        debt_amount: "",
        loan_type: "fixed",
        property_type: "single_family"
    });
    const [mortgages, setMortgages] = useState([]);
    const [rmbsRating, setRmbsRating] = useState("N/A");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMortgages();
        fetchRmbsRating();
    }, []);

    const fetchMortgages = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/mortgages");
            setMortgages(response.data);
            await fetchRmbsRating();
        } catch (error) {
            setError("Failed to fetch mortgages. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRmbsRating = async () => {
        try {
            const response = await axios.get("http://localhost:5000/get_rmbs_rating");  // Updated endpoint
            setRmbsRating(response.data.rating);
        } catch (error) {
            setError("Failed to fetch RMBS rating.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["credit_score", "loan_amount", "property_value", "annual_income", "debt_amount"];
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const validateInput = () => {
        const { credit_score, loan_amount, property_value, annual_income, debt_amount } = formData;
        if (!credit_score || !loan_amount || !property_value || !annual_income || debt_amount === "") {
            return "All fields are required.";
        }
        if (credit_score < 300 || credit_score > 850) {
            return "Credit score must be between 300 and 850.";
        }
        if (loan_amount <= 0 || property_value <= 0 || annual_income <= 0) {
            return "Amounts must be positive.";
        }
        if (debt_amount < 0) {
            return "Debt amount cannot be negative.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");
        setLoading(true);

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/update_mortgage/${editingId}`, formData);
                setEditingId(null);
            } else {
                await axios.post("http://localhost:5000/add_mortgage", formData);
            }
            await fetchMortgages();
            setFormData({
                credit_score: "",
                loan_amount: "",
                property_value: "",
                annual_income: "",
                debt_amount: "",
                loan_type: "fixed",
                property_type: "single_family"
            });
        } catch (error) {
            setError(error.response?.data?.error || `Failed to ${editingId ? "update" : "add"} mortgage.`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mortgage) => {
        setEditingId(mortgage.id);
        setFormData({
            credit_score: mortgage.credit_score,
            loan_amount: mortgage.loan_amount,
            property_value: mortgage.property_value,
            annual_income: mortgage.annual_income,
            debt_amount: mortgage.debt_amount,
            loan_type: mortgage.loan_type,
            property_type: mortgage.property_type
        });
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this mortgage?")) return;
        
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:5000/delete_mortgage/${id}`);
            if (response.status === 200) {
                await fetchMortgages();
                setError("");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Failed to delete mortgage.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "1200px" }}>
            <div className="card p-4 shadow-lg" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
                <h2 className="mb-4 text-center" style={{ color: "#343a40" }}>
                    {editingId ? "Edit Mortgage" : "Add New Mortgage"}
                </h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {[
                            { label: "Credit Score", name: "credit_score", min: 300, max: 850 },
                            { label: "Loan Amount", name: "loan_amount", min: 1 },
                            { label: "Property Value", name: "property_value", min: 1 }
                        ].map(field => (
                            <div className="col-md-4" key={field.name}>
                                <label className="form-label fw-bold">{field.label}</label>
                                <input
                                    type="number"
                                    name={field.name}
                                    className="form-control"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required
                                    min={field.min}
                                    max={field.max}
                                    disabled={loading}
                                    style={{ borderRadius: "8px" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="row g-3 mt-3">
                        {[
                            { label: "Annual Income", name: "annual_income", min: 1 },
                            { label: "Debt Amount", name: "debt_amount", min: 0 }
                        ].map(field => (
                            <div className="col-md-4" key={field.name}>
                                <label className="form-label fw-bold">{field.label}</label>
                                <input
                                    type="number"
                                    name={field.name}
                                    className="form-control"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required
                                    min={field.min}
                                    disabled={loading}
                                    style={{ borderRadius: "8px" }}
                                />
                            </div>
                        ))}
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Loan Type</label>
                            <select
                                name="loan_type"
                                className="form-select"
                                value={formData.loan_type}
                                onChange={handleChange}
                                disabled={loading}
                                style={{ borderRadius: "8px" }}
                            >
                                <option value="fixed">Fixed</option>
                                <option value="adjustable">Adjustable</option>
                            </select>
                        </div>
                    </div>
                    <div className="row g-3 mt-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Property Type</label>
                            <select
                                name="property_type"
                                className="form-select"
                                value={formData.property_type}
                                onChange={handleChange}
                                disabled={loading}
                                style={{ borderRadius: "8px" }}
                            >
                                <option value="single_family">Single Family</option>
                                <option value="condo">Condo</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary mt-4 w-100"
                        disabled={loading}
                        style={{ borderRadius: "8px", backgroundColor: "#007bff", borderColor: "#007bff" }}
                    >
                        {loading ? "Processing..." : editingId ? "Update Mortgage" : "Add Mortgage"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary mt-2 w-100"
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    credit_score: "",
                                    loan_amount: "",
                                    property_value: "",
                                    annual_income: "",
                                    debt_amount: "",
                                    loan_type: "fixed",
                                    property_type: "single_family"
                                });
                                setError("");
                            }}
                            disabled={loading}
                            style={{ borderRadius: "8px" }}
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="mt-4 text-center">
                <h4 style={{ color: "#343a40" }}>
                    RMBS Credit Rating:
                    <span className={`badge ms-2 ${rmbsRating === "AAA" ? "bg-success" : rmbsRating === "BBB" ? "bg-warning" : rmbsRating === "C" ? "bg-danger" : "bg-secondary"}`}>
                        {rmbsRating}
                    </span>
                </h4>
            </div>

            <div className="mt-5">
                <h3 className="text-center" style={{ color: "#343a40" }}>Mortgage Portfolio</h3>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : mortgages.length === 0 ? (
                    <div className="text-center text-muted">No mortgages found.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mt-3" style={{ borderRadius: "10px", overflow: "hidden" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Credit Score</th>
                                    <th>Loan Amount</th>
                                    <th>Property Value</th>
                                    <th>Annual Income</th>
                                    <th>Debt Amount</th>
                                    <th>Loan Type</th>
                                    <th>Property Type</th>
                                    <th>Credit Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mortgages.map((mortgage) => (
                                    <tr key={mortgage.id}>
                                        <td>{mortgage.id}</td>
                                        <td>{mortgage.credit_score}</td>
                                        <td>{mortgage.loan_amount.toLocaleString()}</td>
                                        <td>{mortgage.property_value.toLocaleString()}</td>
                                        <td>{mortgage.annual_income.toLocaleString()}</td>
                                        <td>{mortgage.debt_amount.toLocaleString()}</td>
                                        <td>{mortgage.loan_type}</td>
                                        <td>{mortgage.property_type}</td>
                                        <td>
                                            <span className={`badge ${mortgage.rating === "AAA" ? "bg-success" : mortgage.rating === "BBB" ? "bg-warning" : "bg-danger"}`}>
                                                {mortgage.rating}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEdit(mortgage)}
                                                disabled={loading}
                                                style={{ borderRadius: "5px" }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(mortgage.id)}
                                                disabled={loading}
                                                style={{ borderRadius: "5px" }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MortgageData;