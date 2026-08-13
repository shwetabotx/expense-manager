import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expense from "./pages/Expense";
import "./App.css";
import Login from "./pages/Login";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

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

      </Routes>

    </BrowserRouter>
  );
}

export default App;