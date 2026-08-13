import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getExpenseById,
    updateExpense
} from "../services/expenseService";

function EditExpense() {

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

    // Load expense
    useEffect(() => {

        const loadExpense = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await getExpenseById(id, token);

                const expense = response.data.data;

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

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

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

    if (loading) {

        return (
            <div className="container">
                <h1>Edit Expense</h1>
                <p>Loading expense...</p>
            </div>
        );

    }

    return (
        <div className="container">

            <h1>Edit Expense</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                {/* Title */}

                <div>
                    <label>Title</label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>


                {/* Amount */}

                <div>
                    <label>Amount</label>

                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>


                {/* Category */}

                <div>
                    <label>Category</label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Entertainment">
                            Entertainment
                        </option>
                        <option value="Other">Other</option>
                    </select>
                </div>


                {/* Date */}

                <div>
                    <label>Date</label>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>


                {/* Payment Method */}

                <div>
                    <label>Payment Method</label>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
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


                {/* Notes */}

                <div>
                    <label>Notes</label>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Optional notes"
                    />
                </div>


                {/* Buttons */}

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Updating..."
                        : "Update Expense"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/expenses")}
                >
                    Back
                </button>

            </form>

        </div>
    );
}

export default EditExpense;