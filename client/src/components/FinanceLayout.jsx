import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import {
    HomeIcon,
    ReceiptPercentIcon,
    PlusCircleIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    MagnifyingGlassIcon,
    EnvelopeIcon,
    BellIcon,
    Bars3Icon
} from "@heroicons/react/24/outline";
import "./FinanceLayout.css";

const navItems = [
    { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: HomeIcon },
    { key: "expenses", label: "Expenses", to: "/expenses", icon: ReceiptPercentIcon },
    { key: "add", label: "Add Expense", to: "/expenses/add", icon: PlusCircleIcon }
];

export default function FinanceLayout({ children, active = "" }) {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="finance-shell">
            <aside className="finance-sidebar">
                <div className="finance-brand">
                    <div className="finance-brand-mark">₹</div>
                    <span>Expense<span>Manager</span></span>
                </div>

                <section className="finance-nav-section">
                    <p className="finance-nav-label">MENU</p>
                    <nav>
                        {navItems.map(({ key, label, to, icon: Icon }) => (
                            <Link key={key} to={to} className={`finance-nav-link ${active === key || (!active && location.pathname === to) ? "active" : ""}`}>
                                <Icon />
                                <span>{label}</span>
                                {key === "expenses" && <span className="finance-count">6</span>}
                            </Link>
                        ))}
                    </nav>
                </section>

                <section className="finance-nav-section finance-general">
                    <p className="finance-nav-label">GENERAL</p>
                    <Link to="/profile" className={`finance-nav-link ${active === "profile" ? "active" : ""}`}>
                        <Cog6ToothIcon />
                        <span>Profile &amp; Budget</span>
                    </Link>
                    
                    <button type="button" className="finance-nav-link finance-nav-button" onClick={logout}>
                        <ArrowRightOnRectangleIcon />
                        <span>Logout</span>
                    </button>
                </section>

                <div className="finance-sidebar-tip">
                    <div className="finance-tip-icon">↗</div>
                    <strong>Stay on budget</strong>
                    <p>Track every rupee and keep your monthly spending under control.</p>
                </div>
            </aside>

            <div className="finance-main-wrap">
                <header className="finance-topbar">
                    <button type="button" className="finance-mobile-menu" aria-label="Open menu" onClick={() => document.querySelector(".finance-sidebar")?.classList.toggle("mobile-open")}>
                        <Bars3Icon />
                    </button>
                    

                </header>

                <main className="finance-content">{children}</main>
            </div>
        </div>
    );
}
