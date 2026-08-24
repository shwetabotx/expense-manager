import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    CurrencyRupeeIcon,
    DocumentTextIcon,
    TagIcon,
    CalendarDaysIcon,
    CreditCardIcon,
    PencilSquareIcon,
    CheckIcon
} from "@heroicons/react/24/outline";

import { createExpense } from "../services/expenseService";
import "./AddExpense.css";
import AppShell from "../components/AppShell";

function AddExpense() {

    const today = new Date().toISOString().split("T")[0];

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        paymentMethod: "",
        notes: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // Basic validation

        if (
            !formData.title.trim() ||
            !formData.amount ||
            !formData.category ||
            !formData.date ||
            !formData.paymentMethod
        ) {

            setError("Please fill in all required fields.");

            return;
        }


        if (Number(formData.amount) <= 0) {

            setError("Amount must be greater than 0.");

            return;
        }

        if (formData.date > today) {
            setError("Future dates are not allowed.");
            return;
        }


        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {

                setError("Please login first.");

                return;
            }


            const expenseData = {
                title: formData.title.trim(),

                amount: Number(formData.amount),

                category: formData.category,

                date: formData.date,

                paymentMethod: formData.paymentMethod,

                notes: formData.notes.trim()
            };


            await createExpense(
                expenseData,
                token
            );


            setSuccess(
                "Expense added successfully."
            );


            setTimeout(() => {

                navigate("/expenses");

            }, 700);


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to add expense."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <AppShell title="Add Expense">

        <div className="add-expense-page">

            <div className="add-expense-container">


                {/* Header */}

                <div className="add-expense-header">

                    <div>

                        <p className="add-expense-label">
                            PERSONAL FINANCE
                        </p>

                        <h1>
                            Add Expense
                        </h1>

                        <p className="add-expense-subtitle">
                            Record a new expense and keep your
                            spending organized.
                        </p>

                    </div>


                   

                </div>


                {/* Form */}

                <div className="glass-card add-expense-card">

                    <div className="form-heading">

                        <div className="form-heading-icon">
                            <CurrencyRupeeIcon />
                        </div>

                        <div>

                            <p>
                                NEW TRANSACTION
                            </p>

                            <h2>
                                Expense Details
                            </h2>

                        </div>

                    </div>


                    {error && (

                        <div className="form-message error-message">
                            {error}
                        </div>

                    )}


                    {success && (

                        <div className="form-message success-message">

                            <CheckIcon />

                            {success}

                        </div>

                    )}


                    <form onSubmit={handleSubmit}>


                        {/* Title */}

                        <div className="form-group">

                            <label htmlFor="title">
                                Expense Title
                            </label>

                            <div className="input-wrapper">

                                <DocumentTextIcon />

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Grocery shopping"
                                />

                            </div>

                        </div>


                        {/* Amount */}

                        <div className="form-group">

                            <label htmlFor="amount">
                                Amount
                            </label>

                            <div className="input-wrapper">

                                <CurrencyRupeeIcon />

                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                        </div>


                        <div className="form-row">


                            {/* Category */}

                            <div className="form-group">

                                <label htmlFor="category">
                                    Category
                                </label>

                                <div className="input-wrapper">

                                    <TagIcon />

                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Food">
                                            Food
                                        </option>

                                        <option value="Travel">
                                            Travel
                                        </option>

                                        <option value="Shopping">
                                            Shopping
                                        </option>

                                        <option value="Bills">
                                            Bills
                                        </option>

                                        <option value="Entertainment">
                                            Entertainment
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* Date */}

                            <div className="form-group">

                                <label htmlFor="date">
                                    Date
                                </label>

                                <div className="input-wrapper">

                                    <CalendarDaysIcon />

                                    <input
                                        id="date"
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        max={today}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Payment Method */}

                        <div className="form-group">

                            <label htmlFor="paymentMethod">
                                Payment Method
                            </label>

                            <div className="input-wrapper">

                                <CreditCardIcon />

                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select payment method
                                    </option>

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="Credit Card">
                                        Credit Card
                                    </option>

                                    <option value="Debit Card">
                                        Debit Card
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                    <option value="Net Banking">
                                        Net Banking
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* Notes */}

                        <div className="form-group">

                            <label htmlFor="notes">
                                Notes
                            </label>

                            <div className="input-wrapper textarea-wrapper">

                                <PencilSquareIcon />

                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add any additional notes..."
                                    rows="4"
                                />

                            </div>

                        </div>


                        {/* Buttons */}

                        <div className="form-actions">

                            <Link
                                to="/expenses"
                                className="cancel-btn"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                className="save-expense-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : "Save Expense"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </AppShell>

    );

}

export default AddExpense;
