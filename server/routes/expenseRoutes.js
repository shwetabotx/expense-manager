const express = require("express");

const {
    createExpense,getExpenses,updateExpense,
    deleteExpense,getExpenseById
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);
router.get("/:id", authMiddleware, getExpenseById);

module.exports = router; 
