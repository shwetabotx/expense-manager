const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            paymentMethod,
            notes
        } = req.body;

        if (
            !title ||
            amount === undefined ||
            !category ||
            !date ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const expense = await Expense.create({
            user: req.user.userId,
            title,
            amount,
            category,
            date,
            paymentMethod,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map((err) => err.message)
                .join(", ");

            return res.status(400).json({
                success: false,
                message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create expense"
        });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            user: req.user.userId
        }).sort({
            date: -1
        });

        res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data: expenses
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch expenses"
        });
    }
};

// Update Expense
const updateExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            paymentMethod,
            notes
        } = req.body;

        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        if (title !== undefined) {
            expense.title = title;
        }

        if (amount !== undefined) {
            expense.amount = amount;
        }

        if (category !== undefined) {
            expense.category = category;
        }

        if (date !== undefined) {
            expense.date = date;
        }

        if (paymentMethod !== undefined) {
            expense.paymentMethod = paymentMethod;
        }

        if (notes !== undefined) {
            expense.notes = notes;
        }

        const updatedExpense = await expense.save();

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense
        });

    } catch (error) {
        console.error(error);

        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map((err) => err.message)
                .join(", ");

            return res.status(400).json({
                success: false,
                message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update expense"
        });
    }
};


// Delete Expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete expense"
        });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};