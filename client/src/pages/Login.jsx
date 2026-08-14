import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRightOnRectangleIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { loginUser } from "../services/authService";
import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        if (!formData.email || !formData.password) {

            setError("Please enter your email and password.");

            return;
        }

        try {

            setLoading(true);

            const response = await loginUser(formData);

            const token = response.data.data.token;

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            {/* Background glow */}

            <div className="auth-glow auth-glow-one"></div>

            <div className="auth-glow auth-glow-two"></div>


            <div className="auth-card">

                {/* Icon */}

                <div className="auth-icon">

                    <ArrowRightOnRectangleIcon />

                </div>


                {/* Header */}

                <div className="auth-header">

                    <p className="auth-label">
                        PERSONAL FINANCE
                    </p>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to manage your expenses.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="auth-message auth-error">
                        {error}
                    </div>

                )}


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    {/* Email */}

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
                            autoComplete="email"
                        />

                    </div>


                    {/* Password */}

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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword ? (

                                    <EyeSlashIcon />

                                ) : (

                                    <EyeIcon />

                                )}

                            </button>

                        </div>

                    </div>


                    {/* Login button */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* Register */}

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>

    );
}

export default Login;