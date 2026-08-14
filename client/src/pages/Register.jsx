import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlusIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        monthlyBudget: 30000
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                monthlyBudget: Number(formData.monthlyBudget)
            });

            setSuccess(
                response.data.message ||
                "Registration successful. Please login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-glow auth-glow-one"></div>
            <div className="auth-glow auth-glow-two"></div>

            <div className="auth-card">

                <div className="auth-icon">
                    <UserPlusIcon />
                </div>

                <div className="auth-header">
                    <p className="auth-label">
                        PERSONAL FINANCE
                    </p>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Start managing your expenses today.
                    </p>
                </div>

                {error && (
                    <div className="auth-message auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-message auth-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="auth-field">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    <div className="auth-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    <div className="auth-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="password-toggle"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </button>

                        </div>

                    </div>

                    <div className="auth-field">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="password-toggle"
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </button>

                        </div>

                    </div>

                    <div className="auth-field">

                        <label htmlFor="monthlyBudget">
                            Monthly Budget
                        </label>

                        <input
                            id="monthlyBudget"
                            name="monthlyBudget"
                            type="number"
                            min="0"
                            placeholder="30000"
                            value={formData.monthlyBudget}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;