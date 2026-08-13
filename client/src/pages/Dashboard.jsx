import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowTrendingDownIcon, ArrowTrendingUpIcon, WalletIcon, CalendarDaysIcon, PlusIcon, ChartPieIcon, ChartBarIcon, ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import {
    getDashboard,
    getExpensesByCategory,
    getExpensesByMonth
} from "../services/dashboardService";
import "./Dashboard.css";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalExpenses: 0,
        monthlyExpenses: 0,
        monthlyBudget: 30000,
        currentBalance: 30000
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const loadDashboard = async () => {

        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login first.");
                return;
            }
            const [
                dashboardResponse,
                categoryResponse,
                monthlyResponse
            ] = await Promise.all([
                getDashboard(token),
                getExpensesByCategory(token),
                getExpensesByMonth(token)
            ]);
            setDashboardData(
                dashboardResponse.data.data
            );
            setCategoryData(
                categoryResponse.data.data
            );
            setMonthlyData(
                monthlyResponse.data.data
            );
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();

    }, []);


    const budgetPercentage =
        dashboardData.monthlyBudget > 0
            ? Math.min(
                (
                    dashboardData.monthlyExpenses /
                    dashboardData.monthlyBudget
                ) * 100,
                100
            )
            : 0;

    // REMAINING BUDGET

    const remainingBudget =
        dashboardData.monthlyBudget -
        dashboardData.monthlyExpenses;


    if (loading) {

        return (
            <div className="dashboard">

                <div className="glass-card stat-card">

                    <h2>
                        Loading dashboard...
                    </h2>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="dashboard">

                <div className="glass-card stat-card">

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <p className="dashboard-label">
                        PERSONAL FINANCE
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="dashboard-subtitle">
                        Keep track of your money and spending.
                    </p>

                </div>


                <div className="dashboard-actions">

                    <Link
                        to="/expenses"
                        className="view-expenses-btn"
                    >
                        View All Expenses
                    </Link>


                    <Link
                        to="/expenses/add"
                        className="add-expense-btn"
                    >
                        <PlusIcon className="btn-icon" />

                        Add Expense
                    </Link>

                </div>

            </div>

            <div className="stats-grid">

                <div className="glass-card stat-card">

                    <div className="stat-top">

                        <div className="icon-box income-icon">

                            <ArrowTrendingUpIcon />

                        </div>

                        <span className="stat-tag">
                            Income
                        </span>

                    </div>


                    <p className="stat-title">
                        Total Income
                    </p>


                    <h2>
                        ₹50,000
                    </h2>


                    <p className="stat-description">
                        Money received
                    </p>

                </div>


                <div className="glass-card stat-card">

                    <div className="stat-top">

                        <div className="icon-box expense-icon">

                            <ArrowTrendingDownIcon />

                        </div>

                        <span className="stat-tag">
                            Spending
                        </span>

                    </div>


                    <p className="stat-title">
                        Total Expenses
                    </p>


                    <h2>

                        ₹
                        {dashboardData.totalExpenses.toLocaleString(
                            "en-IN"
                        )}

                    </h2>


                    <p className="stat-description">
                        Total money spent
                    </p>

                </div>

                <div className="glass-card stat-card">

                    <div className="stat-top">

                        <div className="icon-box balance-icon">

                            <WalletIcon />

                        </div>

                        <span className="stat-tag">
                            Balance
                        </span>

                    </div>


                    <p className="stat-title">
                        Current Balance
                    </p>


                    <h2>

                        ₹
                        {dashboardData.currentBalance.toLocaleString(
                            "en-IN"
                        )}

                    </h2>


                    <p className="stat-description">
                        Available balance
                    </p>

                </div>

                <div className="glass-card stat-card">

                    <div className="stat-top">

                        <div className="icon-box monthly-icon">

                            <CalendarDaysIcon />

                        </div>

                        <span className="stat-tag">
                            This Month
                        </span>

                    </div>


                    <p className="stat-title">
                        Monthly Expenses
                    </p>


                    <h2>

                        ₹
                        {dashboardData.monthlyExpenses.toLocaleString(
                            "en-IN"
                        )}

                    </h2>


                    <p className="stat-description">
                        Spending this month
                    </p>

                </div>


            </div>

            <div className="glass-card budget-card">


                <div className="budget-header">


                    <div>

                        <div className="section-icon">

                            <WalletIcon />

                        </div>


                        <div>

                            <p className="budget-label">
                                MONTHLY BUDGET
                            </p>


                            <h2>

                                ₹
                                {dashboardData.monthlyBudget.toLocaleString(
                                    "en-IN"
                                )}

                            </h2>

                        </div>

                    </div>



                    <div className="budget-remaining">

                        <span>
                            Remaining
                        </span>


                        <strong>

                            ₹
                            {remainingBudget.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                </div>

                <div className="budget-progress">

                    <div
                        className="budget-progress-fill"
                        style={{
                            width: `${budgetPercentage}%`
                        }}
                    />

                </div>

                <div className="budget-footer">

                    <span>
                        ₹{dashboardData.monthlyExpenses.toLocaleString("en-IN")} spent
                    </span>

                    <span>
                        {Math.round(budgetPercentage)}%
                    </span>

                </div>


                {dashboardData.monthlyExpenses >
                    dashboardData.monthlyBudget && (

                        <div className="budget-warning">

                            <ExclamationTriangleIcon className="warning-icon" />

                            <span>
                                You have exceeded your monthly budget.
                            </span>

                        </div>

                    )}

            </div>


            <div className="charts-grid">

                <div className="glass-card chart-card">


                    <div className="chart-header">


                        <div>

                            <p className="chart-label">
                                EXPENSE ANALYSIS
                            </p>

                            <h2>
                                Expenses by Category
                            </h2>

                        </div>

                        <div className="chart-icon">
                            <ChartPieIcon />
                        </div>
                    </div>



                    <div className="chart-container">

                        {categoryData.length === 0 ? (

                            <div className="empty-chart">
                                <ChartPieIcon />
                                <p>No expense data available</p>
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height={280}
                            >

                                <PieChart>

                                    <Pie
                                        data={categoryData}
                                        dataKey="total"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={95}
                                        innerRadius={55}
                                        paddingAngle={3}
                                    >

                                        {categoryData.map(
                                            (entry, index) => (

                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        [
                                                            "#8a9a5b",
                                                            "#a3b86c",
                                                            "#6f7f45",
                                                            "#c1cf8a",
                                                            "#596638",
                                                            "#d4dda8"
                                                        ][index % 6]
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${Number(value).toLocaleString("en-IN")}`
                                        }
                                        contentStyle={{
                                            background: "rgba(30, 40, 20, 0.9)",
                                            border: "1px solid rgba(200, 215, 170, 0.2)",
                                            borderRadius: "12px",
                                            color: "#f1f5e9"
                                        }}
                                    />

                                </PieChart>

                            </ResponsiveContainer>

                        )}

                    </div>


                </div>

                <div className="glass-card chart-card">


                    <div className="chart-header">


                        <div>

                            <p className="chart-label">
                                SPENDING TREND
                            </p>

                            <h2>
                                Expenses by Month
                            </h2>

                        </div>


                        <div className="chart-icon">

                            <ChartBarIcon />

                        </div>


                    </div>

                    <div className="chart-container">

                        {monthlyData.length === 0 ? (

                            <div className="empty-chart">
                                <ChartBarIcon />
                                <p>No monthly data available</p>
                            </div>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height={280}
                            >

                                <BarChart
                                    data={monthlyData}
                                >

                                    <CartesianGrid
                                        stroke="rgba(255,255,255,0.06)"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        stroke="#94a3b8"
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        stroke="#94a3b8"
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${Number(value).toLocaleString("en-IN")}`
                                        }
                                        contentStyle={{
                                            background: "rgba(30, 40, 20, 0.9)",
                                            border: "1px solid rgba(200, 215, 170, 0.2)",
                                            borderRadius: "12px",
                                            color: "#f1f5e9"
                                        }}
                                    />

                                    <Bar
                                        dataKey="total"
                                        fill="#8a9a5b"
                                        radius={[8, 8, 0, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        )}

                    </div>

                </div>


            </div>


        </div>
    );
}


export default Dashboard;