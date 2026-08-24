import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

import {
    HomeIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

import {
    getExpenses,
    deleteExpense
} from "../services/expenseService";

import "./Expense.css";
import AppShell from "../components/AppShell";

function Expenses() {

    const today = new Date().toISOString().split("T")[0];

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [search, setSearch] = useState("");

    // Existing category filter
    const [categoryFilter, setCategoryFilter] = useState("");

    // New filters
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState("newest");

    // Delete dialog
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [deleting, setDeleting] = useState(false);


    // 
    // LOAD EXPENSES
    // 

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

            setExpenses(response.data.data || []);

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


    // 
    // DELETE
    // 

    const openDeleteDialog = (expense) => {

        setSelectedExpense(expense);
        setDeleteDialog(true);

    };


    const closeDeleteDialog = () => {

        if (deleting) return;

        setSelectedExpense(null);
        setDeleteDialog(false);

    };


    const handleDelete = async () => {

        if (!selectedExpense) return;

        try {

            setDeleting(true);

            const token = localStorage.getItem("token");

            await deleteExpense(
                selectedExpense._id,
                token
            );

            setExpenses((prevExpenses) =>
                prevExpenses.filter(
                    (expense) =>
                        expense._id !== selectedExpense._id
                )
            );

            setDeleteDialog(false);
            setSelectedExpense(null);

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


    // 
    // CLEAR FILTERS
    // 

    const clearFilters = () => {

        setSearch("");
        setCategoryFilter("");
        setPaymentMethodFilter("");
        setFromDate("");
        setToDate("");
        setSortBy("newest");

    };


    // 
    // FILTER + SORT
    // 

    const filteredExpenses = expenses

        // Search
        .filter((expense) => {

            if (!search.trim()) {
                return true;
            }

            const searchText =
                search.toLowerCase().trim();

            return (
                expense.title
                    ?.toLowerCase()
                    .includes(searchText) ||

                expense.category
                    ?.toLowerCase()
                    .includes(searchText) ||

                expense.notes
                    ?.toLowerCase()
                    .includes(searchText) ||

                expense.paymentMethod
                    ?.toLowerCase()
                    .includes(searchText)
            );

        })

        // Category
        .filter((expense) => {

            if (!categoryFilter) {
                return true;
            }

            return (
                expense.category === categoryFilter
            );

        })

        // Payment method
        .filter((expense) => {

            if (!paymentMethodFilter) {
                return true;
            }

            return (
                expense.paymentMethod ===
                paymentMethodFilter
            );

        })

        // From date
        .filter((expense) => {

            if (!fromDate) {
                return true;
            }

            const expenseDate =
                new Date(expense.date);

            const startDate =
                new Date(fromDate);

            startDate.setHours(
                0,
                0,
                0,
                0
            );

            return expenseDate >= startDate;

        })

        // To date
        .filter((expense) => {

            if (!toDate) {
                return true;
            }

            const expenseDate =
                new Date(expense.date);

            const endDate =
                new Date(toDate);

            endDate.setHours(
                23,
                59,
                59,
                999
            );

            return expenseDate <= endDate;

        })

        // Sort
        .sort((a, b) => {

            switch (sortBy) {

                case "oldest":

                    return (
                        new Date(a.date) -
                        new Date(b.date)
                    );


                case "amount-high":

                    return (
                        Number(b.amount) -
                        Number(a.amount)
                    );


                case "amount-low":

                    return (
                        Number(a.amount) -
                        Number(b.amount)
                    );


                case "title-az":

                    return (
                        a.title || ""
                    ).localeCompare(
                        b.title || ""
                    );


                case "title-za":

                    return (
                        b.title || ""
                    ).localeCompare(
                        a.title || ""
                    );


                case "newest":

                default:

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

            }

        });


    return (

        <AppShell title="Expenses">

            <div className="expenses-page">

                {/*  */}
                {/* HEADER */}
                {/*  */}

                <div className="expenses-header">

                    <div>

                        <p className="expenses-label">
                            PERSONAL FINANCE
                        </p>

                        <h1>
                            Expenses
                        </h1>

                        <p className="expenses-subtitle">
                            Manage and track all your expenses.
                        </p>

                    </div>


                    <div className="expenses-actions">

                        <Link
                            to="/expenses/add"
                            className="add-expense-btn"
                        >

                            <PlusIcon className="btn-icon" />

                            Add Expense

                        </Link>
                    
                    </div>

                </div>


                {/*  */}
                {/* ERROR */}
                {/*  */}

                {error && (

                    <div className="expense-error">

                        <ExclamationTriangleIcon />

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() => setError("")}
                        >
                            <XMarkIcon />
                        </button>

                    </div>

                )}


                {/*  */}
                {/* FILTER CARD */}
                {/*  */}

                <div className="glass-card filters-card">

                    <div className="filters-header">

                        <div className="filters-title">

                            <div className="filter-icon">

                                <FunnelIcon />

                            </div>

                            <div>

                                <p>
                                    EXPENSE MANAGEMENT
                                </p>

                                <h2>
                                    Search & Filter
                                </h2>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >

                            <ArrowPathIcon />

                            Clear Filters

                        </button>

                    </div>


                    <div className="filters-grid">

                        {/* Search */}

                        <div className="filter-field search-field">

                            <label>
                                Search
                            </label>

                            <div className="search-wrapper">

                                <MagnifyingGlassIcon />

                                <input
                                    type="text"
                                    placeholder="Search expenses..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* Category */}

                        <div className="filter-field">

                            <label>
                                Category
                            </label>

                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Categories
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

                                <option value="Health">
                                    Health
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Payment Method */}

                        <div className="filter-field">

                            <label>
                                Payment Method
                            </label>

                            <select
                                value={paymentMethodFilter}
                                onChange={(e) =>
                                    setPaymentMethodFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Payment Methods
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


                        {/* From Date */}

                        <div className="filter-field">

                            <label>
                                From Date
                            </label>

                            <input
                                type="date"
                                value={fromDate}
                                max={today}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value > today ? today : e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* To Date */}

                        <div className="filter-field">

                            <label>
                                To Date
                            </label>

                            <input
                                type="date"
                                value={toDate}
                                max={today}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value > today ? today : e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Sort */}

                        <div className="filter-field">

                            <label>
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                                <option value="amount-high">
                                    Amount: High → Low
                                </option>

                                <option value="amount-low">
                                    Amount: Low → High
                                </option>

                                <option value="title-az">
                                    Title: A → Z
                                </option>

                                <option value="title-za">
                                    Title: Z → A
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/*  */}
                {/* EXPENSE TABLE */}
                {/*  */}

                <div className="glass-card expenses-table-card">

                    <div className="table-header">

                        <div>

                            <p className="table-label">
                                TRANSACTIONS
                            </p>

                            <h2>
                                All Expenses
                            </h2>

                        </div>

                        <span className="expense-count">

                            {filteredExpenses.length}

                            {" "}

                            {filteredExpenses.length === 1
                                ? "expense"
                                : "expenses"}

                        </span>

                    </div>


                    {loading ? (

                        <div className="expenses-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading expenses...
                            </p>

                        </div>

                    ) : filteredExpenses.length === 0 ? (

                        <div className="no-expenses">

                            <div className="empty-icon">

                                <MagnifyingGlassIcon />

                            </div>

                            <h3>
                                No expenses found
                            </h3>

                            <p>
                                Try changing your search
                                or filter settings.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="expenses-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Payment Method
                                        </th>

                                        <th>
                                            Notes
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredExpenses.map(
                                        (expense) => (

                                            <tr
                                                key={
                                                    expense._id
                                                }
                                            >

                                                <td>

                                                    <div className="expense-title">

                                                        <strong>
                                                            {
                                                                expense.title
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    <strong className="expense-amount">

                                                        ₹
                                                        {Number(
                                                            expense.amount
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </strong>

                                                </td>


                                                <td>

                                                    <span className="category-badge">

                                                        {
                                                            expense.category
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    {new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                <td>

                                                    <span className="payment-badge">

                                                        {
                                                            expense.paymentMethod
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="notes-cell">

                                                        {
                                                            expense.notes ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                <td>


                                                    <div className="action-buttons">

                                                        <Link
                                                            to={`/expenses/edit/${expense._id}`}
                                                            className="edit-btn"
                                                            title="Edit expense"
                                                        >

                                                            <PencilSquareIcon />

                                                        </Link>
                                                        
                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            title="Delete expense"
                                                            onClick={() =>
                                                                openDeleteDialog(
                                                                    expense
                                                                )
                                                            }
                                                        >

                                                            <TrashIcon />

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


                {/*  */}
                {/* DELETE DIALOG */}
                {/*  */}

                {deleteDialog && (

                    <div
                        className="delete-overlay"
                        onClick={closeDeleteDialog}
                    >

                        <div
                            className="delete-dialog"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                type="button"
                                className="dialog-close"
                                onClick={closeDeleteDialog}
                                disabled={deleting}
                            >

                                <XMarkIcon />

                            </button>


                            <div className="delete-dialog-content">
                                <div className="delete-warning-icon"><ExclamationTriangleIcon /></div>
                                <div className="delete-dialog-copy">
                                    <span className="delete-dialog-eyebrow">PERMANENT ACTION</span>
                                    <h2>Delete expense?</h2>
                                    <p>You're about to permanently remove <strong>{selectedExpense?.title}</strong>. This action cannot be undone.</p>
                                </div>
                            </div>


                            <div className="delete-dialog-actions">

                                <button
                                    type="button"
                                    className="cancel-delete-btn"
                                    onClick={closeDeleteDialog}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="confirm-delete-btn"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >

                                    {deleting ? (
                                        "Deleting..."
                                    ) : (
                                        <>
                                            <TrashIcon />
                                            Delete
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </AppShell>

    );
}

export default Expenses;
