import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ReceiptPercentIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

import {
    getExpenses,
    deleteExpense as deleteExpenseApi
} from "../services/expenseService";

import "./Expense.css";


function Expense() {

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Expense selected for deletion
    const [deleteExpense, setDeleteExpense] = useState(null);

    // Delete loading state
    const [deleting, setDeleting] = useState(false);

    // LOAD EXPENSES
    const loadExpenses = async () => {

        try {

            setLoading(true);

            setError("");

            const token = localStorage.getItem("token");


            if (!token) {

                setError("Please login first.");

                return;
            }


            const response = await getExpenses(
                {},
                token
            );


            setExpenses(
                response.data.data || []
            );


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
    // LOAD ON PAGE OPEN
    useEffect(() => {

        loadExpenses();

    }, []);

    // DELETE EXPENSE
    const handleDelete = async () => {

        if (!deleteExpense) {
            return;
        }
        try {
            setDeleting(true);
            setError("");
            const token =
                localStorage.getItem("token");
            if (!token) {

                setError("Please login first.");
                setDeleteExpense(null);
                return;
            }
            await deleteExpenseApi(
                deleteExpense._id,
                token
            );

            // Remove deleted expense
            // from current list
            setExpenses(
                (previousExpenses) =>
                    previousExpenses.filter(
                        (expense) =>
                            expense._id !==
                            deleteExpense._id
                    )
            );

            // Close dialog
            setDeleteExpense(null);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to delete expense."
            );
        } finally {
            setDeleting(false);
        }
    };
    // CLOSE DELETE DIALOG
    const closeDeleteDialog = () => {

        if (deleting) {
            return;
        }
        setDeleteExpense(null);
    };
    return (
        <div className="expenses-page">
            {/* ========================================
                HEADER
            ======================================== */}
            <div className="expenses-header">
                <div>
                    <p className="expenses-label">
                        PERSONAL FINANCE
                    </p>

                    <h1>
                        Expenses
                    </h1>

                    <p className="expenses-subtitle">
                        Track and manage your everyday
                        spending.
                    </p>

                </div>

                <div className="expenses-actions">

                    <Link
                        to="/dashboard"
                        className="secondary-btn"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/expenses/add"
                        className="primary-btn"
                    >
                        <PlusIcon />
                        Add Expense
                    </Link>
                </div>
            </div>
            {/* ========================================
                SEARCH / FILTER
            ======================================== */}

            <div className="glass-card expense-toolbar">
                <div className="search-box">
                    <MagnifyingGlassIcon />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                    />
                </div>
                <button
                    className="filter-btn"
                    type="button"
                >
                    <FunnelIcon />
                    Filters
                </button>
            </div>

            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error && !loading && (
                <div className="expense-error">
                    {error}
                </div>

            )}
            {/* ========================================
                EXPENSE CARD
            ======================================== */}
            <div className="glass-card expenses-card">
                {/* Card Header */}
                <div className="expenses-card-header">
                    <div>
                        <p className="section-label">
                            TRANSACTIONS
                        </p>
                        <h2>
                            All Expenses
                        </h2>
                    </div>
                    <div className="expense-count">
                        <ReceiptPercentIcon />
                        <span>
                            {expenses.length} expenses
                        </span>

                    </div>

                </div>
                {/* ========================================
                    LOADING
                ======================================== */}
                {loading && (
                    <div className="expense-state">
                        <div className="loading-spinner"></div>
                        <p>
                            Loading expenses...
                        </p>

                    </div>
                )}

                {/* ========================================
                    ERROR
                ======================================== */}

                {error && !loading && expenses.length === 0 && (

                    <div className="expense-state error-state">
                        <ExclamationTriangleIcon />
                        <p>
                            {error}
                        </p>

                    </div>
                )}

                {/* ========================================
                    NO EXPENSES
                ======================================== */}

                {!loading &&
                    !error &&
                    expenses.length === 0 && (

                        <div className="expense-state">

                            <ReceiptPercentIcon />

                            <h3>
                                No expenses yet
                            </h3>

                            <p>
                                Start tracking your
                                spending by adding
                                your first expense.
                            </p>

                            <Link
                                to="/expenses/add"
                                className="primary-btn"
                            >
                                <PlusIcon />
                                Add Expense
                            </Link>
                        </div>
                    )}

                {/* ========================================
                    EXPENSE TABLE
                ======================================== */}
                {!loading &&
                    !error &&
                    expenses.length > 0 && (
                        <div className="table-wrapper">
                            <table className="expenses-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Expense
                                        </th>
                                        <th>
                                            Category
                                        </th>
                                        <th>
                                            Amount
                                        </th>
                                        <th>
                                            Date
                                        </th>
                                        <th>
                                            Payment
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {expenses.map(
                                        (expense) => (

                                            <tr
                                                key={
                                                    expense._id
                                                }
                                            >


                                                {/* Expense */}

                                                <td>

                                                    <div className="expense-title">

                                                        <div className="expense-icon">

                                                            <ReceiptPercentIcon />

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    expense.title
                                                                }
                                                            </strong>


                                                            {expense.notes && (

                                                                <span>
                                                                    {
                                                                        expense.notes
                                                                    }
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Category */}

                                                <td>

                                                    <span
                                                        className={`category-badge ${
                                                            expense.category
                                                                ?.toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )
                                                        }`}
                                                    >

                                                        {
                                                            expense.category
                                                        }

                                                    </span>

                                                </td>


                                                {/* Amount */}

                                                <td>

                                                    <strong className="amount">

                                                        ₹
                                                        {Number(
                                                            expense.amount
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </strong>

                                                </td>


                                                {/* Date */}

                                                <td>

                                                    {new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                {/* Payment */}

                                                <td>

                                                    <span className="payment-method">

                                                        {
                                                            expense.paymentMethod
                                                        }

                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <div className="table-actions">


                                                        {/* Edit */}

                                                        <Link
                                                            to={`/expenses/edit/${expense._id}`}
                                                            className="icon-btn edit-btn"
                                                            title="Edit expense"
                                                        >

                                                            <PencilSquareIcon />

                                                        </Link>


                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                setDeleteExpense(
                                                                    expense
                                                                )
                                                            }
                                                            title="Delete expense"
                                                        >

                                                            <TrashIcon />

                                                            Delete

                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}
            </div>
            {/* ========================================
                DELETE CONFIRMATION MODAL
            ======================================== */}
            {deleteExpense && (
                <div
                    className="delete-modal-overlay"
                    onClick={closeDeleteDialog}
                >
                    <div
                        className="delete-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* Close */}
                        <button
                            type="button"
                            className="delete-modal-close"
                            onClick={closeDeleteDialog}
                            disabled={deleting}
                            aria-label="Close"
                        >
                            <XMarkIcon />
                        </button>
                        {/* Warning Icon */}
                        <div className="delete-warning-icon">
                            <ExclamationTriangleIcon />
                        </div>
                        {/* Title */}
                        <h2>
                            Delete Expense?
                        </h2>


                        {/* Description */}
                        <p className="delete-modal-text">
                            Are you sure you want to
                            delete
                            <strong>
                                {" "}
                                {deleteExpense.title}
                            </strong>
                            ?

                        </p>
                        <p className="delete-modal-subtext">
                            This action cannot be undone.
                        </p>
                        {/* Buttons */}

                        <div className="delete-modal-actions">

                            {/* Cancel */}
                            <button
                                type="button"
                                className="delete-cancel-btn"
                                onClick={closeDeleteDialog}
                                disabled={deleting}
                            >

                                Cancel

                            </button>


                            {/* Confirm Delete */}

                            <button
                                type="button"
                                className="delete-confirm-btn"
                                onClick={handleDelete}
                                disabled={deleting}
                            >

                                <TrashIcon />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Expense"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Expense;