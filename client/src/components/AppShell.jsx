import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  WalletIcon, HomeIcon, ReceiptPercentIcon, CreditCardIcon,
  Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon,
  ChartBarIcon, ArrowUpRightIcon, MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import LogoutDialog from "./LogoutDialog";
import { useState } from "react";
import "../pages/Dashboard.css";

export default function AppShell({ children, title = "Expense Manager" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = (path) => location.pathname === path || (path === "/expenses" && location.pathname.startsWith("/expenses"));
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };
  return (
    <div className="dashboard-shell app-shell">
      <aside className="dashboard-sidebar">
        <div className="brand"><span className="brand-mark"><WalletIcon/></span><span>Expense<span>Manager</span></span></div>
        <div className="sidebar-section-label">MENU</div>
        <nav className="sidebar-nav">
          <Link className={`sidebar-link ${active("/dashboard") ? "active" : ""}`} to="/dashboard"><HomeIcon/>Dashboard</Link>
          <Link className={`sidebar-link ${active("/expenses") && location.pathname !== "/expenses/add" ? "active" : ""}`} to="/expenses"><ReceiptPercentIcon/>Expenses</Link>
          <Link className={`sidebar-link ${active("/expenses/add") ? "active" : ""}`} to="/expenses/add"><CreditCardIcon/>Add Expense</Link>
        </nav>
        <div className="sidebar-section-label">GENERAL</div>
        <nav className="sidebar-nav">
          <Link className={`sidebar-link ${active("/profile") ? "active" : ""}`} to="/profile"><Cog6ToothIcon/>Profile &amp; Budget</Link>
          <button className="sidebar-link sidebar-button" onClick={() => setLogoutOpen(true)}><ArrowRightOnRectangleIcon/>Logout</button>
        </nav>
        <div className="sidebar-bottom-card"><div className="sidebar-bottom-icon"><ChartBarIcon/></div><strong>Stay on budget</strong><p>Track every rupee and keep your monthly spending under control.</p></div>
      </aside>
      <main className="dashboard-main app-shell-main">
       
        <div className="app-shell-content">{children}</div>
      </main>
      <LogoutDialog open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={logout} />
    </div>
  );
}
