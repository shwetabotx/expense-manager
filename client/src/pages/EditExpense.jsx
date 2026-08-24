import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeftIcon,
    CheckIcon,
    CurrencyRupeeIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    CreditCardIcon,
    TagIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline"; 

import {
    getExpenseById,
    updateExpense
} from "../services/expenseService";

import "./EditExpense.css";
import AppShell from "../components/AppShell";
import ThemeToggle from "../components/ThemeToggle";


function EditExpense() {

    const today = new Date().toISOString().split("T")[0];

    const { id } = useParams();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        date: "",
        paymentMethod: "UPI",
        notes: ""
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");



    // LOAD EXPENSE


    useEffect(() => {

        const loadExpense = async () => {

            try {

                if (!id || id === "undefined" || id === "null") {
                    setError("The expense could not be opened because its ID is missing.");
                    setLoading(false);
                    return;
                }

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await getExpenseById(id, token);
                const expense = response?.data?.data || response?.data;

                if (!expense) {
                    throw new Error("Expense not found.");
                }

                setFormData({
                    title: expense.title,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date
                        ? expense.date.split("T")[0]
                        : "",
                    paymentMethod: expense.paymentMethod,
                    notes: expense.notes || ""
                });


            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load expense."
                );

            } finally {

                setLoading(false);

            }

        };


        loadExpense();

    }, [id]);



    // HANDLE CHANGE


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };



    // HANDLE SUBMIT


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // Validation

        if (!formData.title.trim()) {

            setError("Title is required.");

            return;

        }


        if (!formData.amount || Number(formData.amount) <= 0) {

            setError("Amount must be greater than 0.");

            return;

        }


        if (!formData.date) {

            setError("Date is required.");

            return;

        }


        try {

            setSaving(true);

            const token = localStorage.getItem("token");


            if (!token) {

                setError("Please login first.");

                return;

            }


            await updateExpense(
                id,
                {
                    ...formData,
                    amount: Number(formData.amount)
                },
                token
            );


            navigate("/expenses");


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update expense."
            );

        } finally {

            setSaving(false);

        }

    };



    // LOADING


    if (loading) {

        return (
            <AppShell title="Edit Expense">
                <div className="edit-expense-page">
                    <div className="edit-loading glass-card">
                        <div className="loading-spinner"></div>
                        <p>Loading expense...</p>
                    </div>
                </div>
            </AppShell>
        );

    }



    // PAGE


    return (

        <AppShell title="Edit Expense">

        <div className="edit-expense-page">


            {/* Header */}

            <div className="edit-expense-header">

                <div>

                    <p className="edit-expense-label">
                        TRANSACTION MANAGEMENT
                    </p>

                    <h1>
                        Edit Expense
                    </h1>

                    <p className="edit-expense-subtitle">
                        Update the details of your transaction.
                    </p>

                </div>


                <div className="edit-expense-header-actions">

                    <ThemeToggle />

                    <button
                        type="button"
                        className="back-expenses-btn"
                        onClick={() => navigate("/expenses")}
                    >

                        <ArrowLeftIcon />

                        <span>
                            Back to Transactions
                        </span>

                    </button>

                </div>

            </div>


            {/* Error */}

            {error && (

                <div className="edit-expense-error">

                    <ExclamationCircleIcon />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* Form Card */}

            <div className="glass-card edit-form-card">


                {/* Card Header */}

                <div className="edit-form-header">

                    <div className="edit-form-icon">

                        <DocumentTextIcon />

                    </div>

                    <div>

                        <p>
                            EXPENSE DETAILS
                        </p>

                        <h2>
                            Update Transaction
                        </h2>

                    </div>

                </div>


                <form onSubmit={handleSubmit}>


                    {/* Main Fields */}

                    <div className="edit-form-grid">


                        {/* Title */}

                        <div className="edit-field">

                            <label htmlFor="title">
                                Title
                            </label>

                            <div className="edit-input-wrapper">

                                <DocumentTextIcon />

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Grocery shopping"
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* Amount */}

                        <div className="edit-field">

                            <label htmlFor="amount">
                                Amount
                            </label>

                            <div className="edit-input-wrapper">

                                <CurrencyRupeeIcon />

                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* Category */}

                        <div className="edit-field">

                            <label htmlFor="category">
                                Category
                            </label>

                            <div className="edit-input-wrapper">

                                <TagIcon />

                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={saving}
                                >

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

                        <div className="edit-field">

                            <label htmlFor="date">
                                Date
                            </label>

                            <div className="edit-input-wrapper">

                                <CalendarDaysIcon />

                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    max={today}
                                    onChange={handleChange}
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* Payment Method */}

                        <div className="edit-field">

                            <label htmlFor="paymentMethod">
                                Payment Method
                            </label>

                            <div className="edit-input-wrapper">

                                <CreditCardIcon />

                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    disabled={saving}
                                >

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

                        <div className="edit-field edit-notes-field">

                            <label htmlFor="notes">
                                Notes
                                <span>
                                    Optional
                                </span>
                            </label>

                            <div className="edit-textarea-wrapper">

                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add any additional notes about this expense..."
                                    disabled={saving}
                                    rows="5"
                                />

                            </div>

                        </div>

                    </div>


                    {/* Divider */}

                    <div className="edit-form-divider"></div>


                    {/* Actions */}

                    <div className="edit-form-actions">

                        <button
                            type="button"
                            className="edit-cancel-btn"
                            onClick={() => navigate("/expenses")}
                            disabled={saving}
                        >

                            <ArrowLeftIcon />

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="edit-save-btn"
                            disabled={saving}
                        >

                            <CheckIcon />

                            {saving
                                ? "Updating..."
                                : "Update Expense"
                            }

                        </button>

                    </div>


                </form>

            </div>


        </div>

    </AppShell>

    );

}


export default EditExpense;
