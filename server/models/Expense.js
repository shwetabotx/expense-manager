const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"]
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Food",
                "Travel",
                "Shopping",
                "Bills",
                "Entertainment",
                "Other"
            ]
        },

        date: {
            type: Date,
            required: [true, "Date is required"]
        },

        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            enum: [
                "Cash",
                "Credit Card",
                "Debit Card",
                "UPI",
                "Net Banking",
                "Other"
            ]
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);