import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expense from "./pages/Expense";
import "./App.css";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/expenses"
          element={<Expense />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/expenses/add"
          element={<AddExpense />}
        />

        <Route
          path="/expenses/edit/:id"
          element={<EditExpense />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;