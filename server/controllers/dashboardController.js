const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const User = require("../models/User");


// GET DASHBOARD


const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        
        // TOTAL EXPENSES
        

        const totalExpensesResult = await Expense.aggregate([
            {
                $match: {
                    user: user._id
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalExpenses =
            totalExpensesResult.length > 0
                ? totalExpensesResult[0].total
                : 0;

        
        // THIS MONTH'S EXPENSES
        

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        const monthlyExpensesResult = await Expense.aggregate([
            {
                $match: {
                    user: user._id,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const monthlyExpenses =
            monthlyExpensesResult.length > 0
                ? monthlyExpensesResult[0].total
                : 0;

        
        // MONTHLY INCOME
        

        const monthlyIncome =
            Number(user.monthlyIncome || 0);

        
        // MONTHLY BUDGET
        

        const monthlyBudget =
            Number(user.monthlyBudget || 0);

        
        // CURRENT BALANCE
        

        const currentBalance =
            monthlyIncome - monthlyExpenses;

        
        // RESPONSE
        

        res.status(200).json({
            success: true,

            data: {
                totalExpenses,
                monthlyExpenses,
                monthlyBudget,
                monthlyIncome,
                currentBalance
            }
        });

    } catch (error) {
        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });
    }
};



// EXPENSES BY CATEGORY


const getExpensesByCategory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },

            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    total: -1
                }
            }
        ]);

        const formattedData = data.map((item) => ({
            category: item._id,
            total: item.total
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error(
            "Category chart error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load category data"
        });
    }
};



// EXPENSES BY MONTH


const getExpensesByMonth = async (req, res) => {
    try {
        const userId = req.user.userId;

        const data = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },

            {
                $group: {
                    _id: {
                        year: {
                            $year: "$date"
                        },

                        month: {
                            $month: "$date"
                        }
                    },

                    total: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const formattedData = data.map((item) => ({
            month:
                monthNames[item._id.month - 1],

            year:
                item._id.year,

            total:
                item.total
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error(
            "Monthly chart error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load monthly data"
        });
    }
};



// EXPORT


module.exports = {
    getDashboard,
    getExpensesByCategory,
    getExpensesByMonth
};