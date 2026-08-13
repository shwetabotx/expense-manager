import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import { Link } from "react-router-dom";

function Expense() {

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadExpenses = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                return;
            }

            const response = await getExpenses({}, token);

            setExpenses(response.data.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load expenses."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    return (
        <div className="container">

            <h1>Expenses</h1>
            <Link to="/expenses/add">
                <button>
                    Add Expense
                </button>
            </Link>

            {loading && (
                <p>Loading expenses...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading && !error && (
                <>
                    {expenses.length === 0 ? (

                        <p>No expenses found.</p>

                    ) : (

                        <table>

                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Payment Method</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>

                            <tbody>

                                {expenses.map((expense) => (

                                    <tr key={expense._id}>

                                        <td>
                                            {expense.title}
                                        </td>

                                        <td>
                                            ₹{expense.amount}
                                        </td>

                                        <td>
                                            {expense.category}
                                        </td>

                                        <td>
                                            {new Date(
                                                expense.date
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {expense.paymentMethod}
                                        </td>

                                        <td>
                                            {expense.notes || "-"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}
                </>
            )}

        </div>
    );
}

export default Expense;