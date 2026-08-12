import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expense from "./pages/Expense";
import "./App.css";
import Login from "./pages/Login";

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

      </Routes>

    </BrowserRouter>
  );
}

export default App;