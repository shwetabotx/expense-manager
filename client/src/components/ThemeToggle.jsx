import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            className={`theme-switch ${isDark ? "is-dark" : ""}`}
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <span className="theme-switch-icon">{isDark ? <MoonIcon /> : <SunIcon />}</span>
            <span className="theme-switch-label">{isDark ? "Dark" : "Light"}</span>
            <span className="theme-switch-track"><span className="theme-switch-thumb" /></span>
        </button>
    );
}
