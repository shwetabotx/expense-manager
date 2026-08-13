import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// DASHBOARD SUMMARY
export const getDashboard = (token) => {

    return API.get("/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};
// EXPENSES BY CATEGORY

export const getExpensesByCategory = (token) => {

    return API.get("/dashboard/category", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};

// EXPENSES BY MONTH
export const getExpensesByMonth = (token) => {

    return API.get("/dashboard/monthly", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

};