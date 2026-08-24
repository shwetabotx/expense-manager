import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LogoutDialog from "../components/LogoutDialog";
import {
  ArrowTrendingDownIcon, ArrowTrendingUpIcon, WalletIcon, CalendarDaysIcon,
  PlusIcon, ChartPieIcon, ChartBarIcon, ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon, HomeIcon, ReceiptPercentIcon, CreditCardIcon,
  Cog6ToothIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon, BellIcon,
  EnvelopeIcon, ArrowUpRightIcon, ChevronRightIcon
} from "@heroicons/react/24/outline";
import { getDashboard, getExpensesByCategory, getExpensesByMonth } from "../services/dashboardService";
import { getExpenses } from "../services/expenseService";
import { getProfile } from "../services/profileService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import "./Dashboard.css";

const COLORS = ["#17815c", "#58b98e", "#0e543e", "#8dd6b1", "#b9e4cf", "#315f50"];
const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;
const date = (v) => v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ totalExpenses: 0, monthlyExpenses: 0, monthlyBudget: 0, monthlyIncome: 0, currentBalance: 0 });
  const [categories, setCategories] = useState([]);
  const [months, setMonths] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const [d, c, m, e, p] = await Promise.all([
          getDashboard(token), getExpensesByCategory(token), getExpensesByMonth(token), getExpenses({}, token), getProfile(token)
        ]);
        setData(d.data.data); setCategories(c.data.data || []); setMonths(m.data.data || []);
        setExpenses((e.data.data || []).slice(0, 6)); setProfile(p.data.data || {});
      } catch (err) {
        if (err.response?.status === 401) { localStorage.removeItem("token"); return navigate("/login"); }
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  const used = data.monthlyBudget > 0 ? Math.min((data.monthlyExpenses / data.monthlyBudget) * 100, 100) : 0;
  const remaining = data.monthlyBudget - data.monthlyExpenses;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? expenses.filter(e => `${e.title} ${e.category} ${e.paymentMethod}`.toLowerCase().includes(q)) : expenses;
  }, [expenses, search]);
  const initials = (profile.name || "U").split(" ").filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join("");
  const firstName = profile.name?.trim()?.split(" ")[0] || "there";
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  if (loading) return <div className="dashboard-loading"><div className="loading-orb"/><p>Loading your dashboard...</p></div>;
  if (error) return <div className="dashboard-error-card"><div className="empty-icon"><ExclamationTriangleIcon/></div><h2>Dashboard unavailable</h2><p>{error}</p><button onClick={() => navigate("/login")}>Go to Login</button></div>;

  return <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <div className="brand"><span className="brand-mark"><WalletIcon/></span><span>Expense<span>Manager</span></span></div>
      <div className="sidebar-section-label">MENU</div>
      <nav className="sidebar-nav">
        <Link className="sidebar-link active" to="/dashboard"><HomeIcon/>Dashboard</Link>
        <Link className="sidebar-link" to="/expenses"><ReceiptPercentIcon/>Expenses<b>{expenses.length}</b></Link>
        <Link className="sidebar-link" to="/expenses/add"><CreditCardIcon/>Add Expense</Link>
      </nav>
      <div className="sidebar-section-label">GENERAL</div>
      <nav className="sidebar-nav">
        <Link className="sidebar-link" to="/profile"><Cog6ToothIcon/>Profile & Budget</Link>
      
        <button className="sidebar-link sidebar-button" onClick={() => setLogoutOpen(true)}><ArrowRightOnRectangleIcon/>Logout</button>
      </nav>
      <div className="sidebar-bottom-card"><div className="sidebar-bottom-icon"><ChartBarIcon/></div><strong>Stay on budget</strong><p>Track every rupee and keep your monthly spending under control.</p></div>
    </aside>

    <main className="dashboard-main">
      <header className="dashboard-topbar">
        <div className="search-box"><MagnifyingGlassIcon/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expense"/></div>
        <div className="topbar-actions"><div className="user-chip"><div className="avatar">{initials}</div><div className="user-copy"><strong>{profile.name || "User"}</strong><small>{profile.email || "Your account"}</small></div></div><ThemeToggle/></div>
      </header>

      <section className="dashboard-heading-row"><div><h1>Dashboard</h1><p>Welcome back, {firstName}. Here is your financial overview.</p></div><div className="heading-actions"><Link to="/expenses" className="outline-action">View expenses</Link><Link to="/expenses/add" className="primary-action"><PlusIcon/>Add Expense</Link></div></section>

      <section className="stats-grid">
        <Stat title="Total Income" value={data.monthlyIncome} icon={<ArrowTrendingUpIcon/>} note="Monthly income"/>
        <Stat title="Total Expenses" value={data.totalExpenses} icon={<ArrowTrendingDownIcon/>} note="All recorded spending"/>
        <Stat title="Current Balance" value={data.currentBalance} icon={<WalletIcon/>} note="Income minus this month's expenses"/>
        <Stat title="Monthly Budget" value={data.monthlyBudget} icon={<CalendarDaysIcon/>} note={`${Math.round(used)}% used this month`}/>
      </section>

      <section className="dashboard-grid top-grid">
        <div className="panel analytics-panel"><PanelHead eyebrow="SPENDING ANALYTICS" title="Monthly expenses" href="/expenses"/><div className="chart-area">{months.length ? <ResponsiveContainer width="100%" height={255}><BarChart data={months} barCategoryGap="28%"><CartesianGrid stroke="var(--chart-grid)" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"var(--chart-text)",fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--chart-text)",fontSize:12}} tickFormatter={v => `₹${v >= 1000 ? `${Math.round(v/1000)}k` : v}`}/><Tooltip formatter={v => money(v)} contentStyle={{background:"var(--chart-tooltip-bg)",border:"1px solid var(--chart-tooltip-border)",borderRadius:12,color:"var(--text)"}}/><Bar dataKey="total" fill="#17815c" radius={[9,9,2,2]}/></BarChart></ResponsiveContainer> : <Empty icon={<ChartBarIcon/>} text="No monthly expense data yet."/>}</div></div>
        <div className="panel budget-panel"><PanelHead eyebrow="MONTHLY PLAN" title="Budget status" icon={<WalletIcon/>}/><div className="budget-ring-wrap"><div className="budget-ring" style={{"--budget-progress":`${used}%`}}><div><strong>{Math.round(used)}%</strong><span>used</span></div></div><div className="budget-copy"><span>Remaining</span><strong className={remaining < 0 ? "negative" : ""}>{money(remaining)}</strong><small>{money(data.monthlyExpenses)} spent of {money(data.monthlyBudget)}</small></div></div><div className="budget-progress-line"><span style={{width:`${used}%`}}/></div>{data.monthlyExpenses > data.monthlyBudget && data.monthlyBudget > 0 && <div className="budget-warning"><ExclamationTriangleIcon/>You have exceeded your monthly budget.</div>}</div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel recent-panel"><PanelHead eyebrow="TRANSACTIONS" title="Recent expenses" href="/expenses"/><div className="expense-list">{filtered.length ? filtered.map(e => <Link className="expense-row" key={e._id} to={`/expenses/edit/${e._id}`}><span className="expense-avatar">{(e.title || "E")[0].toUpperCase()}</span><span className="expense-main"><strong>{e.title}</strong><small>{e.category} · {date(e.date)}</small></span><span className="expense-method">{e.paymentMethod}</span><strong className="expense-amount">-{money(e.amount)}</strong><ChevronRightIcon/></Link>) : <Empty icon={<ReceiptPercentIcon/>} text="No matching expenses found."/>}</div></div>
        <div className="panel category-panel"><PanelHead eyebrow="BREAKDOWN" title="By category" icon={<ChartPieIcon/>}/>{categories.length ? <><div className="category-visual"><ResponsiveContainer width="100%" height={175}><PieChart><Pie data={categories} dataKey="total" nameKey="category" innerRadius={48} outerRadius={72} paddingAngle={3} stroke="none">{categories.map((e,i)=><Cell key={e.category} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>money(v)} contentStyle={{background:"var(--chart-tooltip-bg)",border:"1px solid var(--chart-tooltip-border)",borderRadius:12,color:"var(--text)"}}/></PieChart></ResponsiveContainer><div className="category-center"><strong>{money(categories[0].total)}</strong><span>top category</span></div></div><div className="category-legend">{categories.slice(0,5).map((e,i)=><div className="category-item" key={e.category}><i style={{background:COLORS[i%COLORS.length]}}/><span>{e.category}</span><strong>{money(e.total)}</strong></div>)}</div></> : <Empty icon={<ChartPieIcon/>} text="No category data yet."/>}</div>
      </section>
    </main>
    <LogoutDialog open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={logout} />
  </div>;
}

function Stat({highlight,title,value,icon,note}) { return <div className={`stat-card ${highlight ? "stat-highlight" : ""}`}><div className="stat-card-top"><span>{title}</span><span className="round-arrow"><ArrowUpRightIcon/></span></div><strong>{money(value)}</strong><small>{icon}{note}</small></div>; }
function PanelHead({eyebrow,title,href,icon}) { return <div className="panel-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href ? <Link to={href} className="panel-link">Details <ArrowUpRightIcon/></Link> : <div className="small-icon">{icon}</div>}</div>; }
function Empty({icon,text}) { return <div className="empty-state">{icon}<p>{text}</p></div>; }
