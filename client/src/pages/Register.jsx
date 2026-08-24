import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlusIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { registerUser } from "../services/authService";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        monthlyIncome: "",
        monthlyBudget: ""
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

        // Required fields
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            formData.monthlyIncome === "" ||
            formData.monthlyBudget === ""
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        // Convert values to numbers
        const income = Number(formData.monthlyIncome);
        const budget = Number(formData.monthlyBudget);

        // Validate income
        if (!Number.isFinite(income) || income < 0) {
            setError("Please enter a valid monthly income.");
            return;
        }

        // Validate budget
        if (!Number.isFinite(budget) || budget < 0) {
            setError("Please enter a valid monthly budget.");
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Validate password length
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
                monthlyIncome: income,
                monthlyBudget: budget
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

                    {/* NAME */}

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


                    {/* EMAIL */}

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


                    {/* PASSWORD */}

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


                    {/* CONFIRM PASSWORD */}

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


                    {/* MONTHLY INCOME */}

                    <div className="auth-field">

                        <label htmlFor="monthlyIncome">
                            Monthly Income
                        </label>

                        <input
                            id="monthlyIncome"
                            name="monthlyIncome"
                            type="number"
                            min="0"
                            placeholder="Enter your monthly income"
                            value={formData.monthlyIncome}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* MONTHLY BUDGET */}

                    <div className="auth-field">

                        <label htmlFor="monthlyBudget">
                            Monthly Budget
                        </label>

                        <input
                            id="monthlyBudget"
                            name="monthlyBudget"
                            type="number"
                            min="0"
                            placeholder="Enter your monthly budget"
                            value={formData.monthlyBudget}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>


                    {/* SUBMIT */}

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


                {/* FOOTER */}

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