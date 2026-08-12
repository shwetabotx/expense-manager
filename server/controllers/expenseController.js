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

module.exports = {
    createExpense
};