const express = require("express");

const {
    getDashboard,
    getExpensesByCategory,
    getExpensesByMonth
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Dashboard statistics
router.get(
    "/",
    authMiddleware,
    getDashboard
);


// Expenses by category
router.get(
    "/category",
    authMiddleware,
    getExpensesByCategory
);


// Expenses by month
router.get(
    "/monthly",
    authMiddleware,
    getExpensesByMonth
);


module.exports = router;