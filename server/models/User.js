const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        income: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        monthlyBudget: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

         monthlyIncome: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);