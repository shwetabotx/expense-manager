import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Get all expenses
export const getExpenses = (params = {}, token) => {
    return API.get("/expenses", {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Get expense by ID
export const getExpenseById = (id, token) => {
    return API.get(`/expenses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Create expense
export const createExpense = (expenseData, token) => {
    return API.post("/expenses", expenseData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Update expense
export const updateExpense = (id, expenseData, token) => {
    return API.put(`/expenses/${id}`, expenseData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Delete expense
export const deleteExpense = (id, token) => {
    return API.delete(`/expenses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};