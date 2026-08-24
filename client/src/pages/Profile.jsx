import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    UserCircleIcon,
    EnvelopeIcon,
    CurrencyRupeeIcon,
    WalletIcon,
    ArrowLeftIcon,
    PencilIcon
} from "@heroicons/react/24/outline";

import {
    getProfile,
    updateProfile
} from "../services/profileService";

import "./Profile.css";
import AppShell from "../components/AppShell";


function Profile() {

    const navigate = useNavigate();


    const [profile, setProfile] = useState({
        name: "",
        email: "",
        monthlyIncome: 0,
        monthlyBudget: 0,
        createdAt: ""
    });


    const [formData, setFormData] = useState({
        name: "",
        monthlyIncome: "",
        monthlyBudget: ""
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;

            }


            const response = await getProfile(token);

            const user = response.data.data;


            setProfile(user);


            setFormData({

                name: user.name || "",

                monthlyIncome:
                    user.monthlyIncome ?? 0,

                monthlyBudget:
                    user.monthlyBudget ?? 0

            });


        } catch (error) {

            console.error(error);


            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;

            }


            setError(
                error.response?.data?.message ||
                "Failed to load profile."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadProfile();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({

            ...formData,

            [name]: value

        });

    };


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.name.trim()) {

            setError("Name is required.");

            return;

        }


        if (
            formData.monthlyIncome === "" ||
            Number(formData.monthlyIncome) < 0
        ) {

            setError(
                "Monthly income must be a valid number."
            );

            return;

        }


        if (
            formData.monthlyBudget === "" ||
            Number(formData.monthlyBudget) < 0
        ) {

            setError(
                "Monthly budget must be a valid number."
            );

            return;

        }


        try {

            setSaving(true);


            const token = localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;

            }


            const response = await updateProfile(

                {

                    name: formData.name.trim(),

                    monthlyIncome:
                        Number(formData.monthlyIncome),

                    monthlyBudget:
                        Number(formData.monthlyBudget)

                },

                token

            );


            setProfile(response.data.data);

            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );


        } catch (error) {

            console.error(error);


            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;

            }


            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );


        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {

        setFormData({

            name: profile.name || "",

            monthlyIncome:
                profile.monthlyIncome ?? 0,

            monthlyBudget:
                profile.monthlyBudget ?? 0

        });

        setError("");
        setSuccess("");

        setEditing(false);

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="profile-page">

                <div className="profile-card">

                    <h2>
                        Loading profile...
                    </h2>

                </div>

            </div>

        );

    }


    return (

        <AppShell title="Profile & Budget">

        <div className="profile-page">

            {/* Header */}

            <div className="profile-header">

                <div>

                    <p className="profile-label">
                        ACCOUNT
                    </p>

                    <h1>
                        My Profile
                    </h1>

                    <p className="profile-subtitle">
                        Manage your personal information,
                        income and monthly budget.
                    </p>

                </div>


                {!editing && (

                    <button
                        type="button"
                        className="profile-edit-btn"
                        onClick={() => {

                            setEditing(true);
                            setError("");
                            setSuccess("");

                        }}
                    >

                        <PencilIcon />

                        Edit Profile

                    </button>

                )}

            </div>


            {/* Messages */}

            {error && (

                <div className="profile-message profile-error">

                    {error}

                </div>

            )}


            {success && (

                <div className="profile-message profile-success">

                    {success}

                </div>

            )}


            <div className="profile-grid">


                {/* Personal Information */}

                <div className="profile-card">


                    <div className="profile-card-header">

                        <div className="profile-card-icon">

                            <UserCircleIcon />

                        </div>

                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Your account details
                            </p>

                        </div>

                    </div>


                    {editing ? (

                        <form onSubmit={handleSubmit}>


                            {/* Name */}

                            <div className="profile-field">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />

                            </div>


                            {/* Email */}

                            <div className="profile-field">

                                <label>
                                    Email
                                </label>

                                <div className="profile-input-wrapper">

                                    <EnvelopeIcon />

                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                    />

                                </div>

                                <small>
                                    Email cannot be changed.
                                </small>

                            </div>


                            {/* Income */}

                            <div className="profile-field">

                                <label>
                                    Monthly Income
                                </label>

                                <div className="profile-input-wrapper">

                                    <CurrencyRupeeIcon />

                                    <input
                                        type="number"
                                        name="monthlyIncome"
                                        value={formData.monthlyIncome}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />

                                </div>

                            </div>


                            {/* Budget */}

                            <div className="profile-field">

                                <label>
                                    Monthly Budget
                                </label>

                                <div className="profile-input-wrapper">

                                    <WalletIcon />

                                    <input
                                        type="number"
                                        name="monthlyBudget"
                                        value={formData.monthlyBudget}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="profile-form-actions">

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>


                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >

                                    Cancel

                                </button>

                            </div>


                        </form>

                    ) : (

                        <div className="profile-details">


                            <div className="profile-detail">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {profile.name}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {profile.email}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Monthly Income
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        profile.monthlyIncome
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Monthly Budget
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        profile.monthlyBudget
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>


                            <div className="profile-detail">

                                <span>
                                    Account Created
                                </span>

                                <strong>
                                    {profile.createdAt
                                        ? new Date(
                                            profile.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "—"}
                                </strong>

                            </div>


                        </div>

                    )}

                </div>


                {/* Financial Summary */}

                <div className="profile-card">


                    <div className="profile-card-header">

                        <div className="profile-card-icon">

                            <WalletIcon />

                        </div>

                        <div>

                            <h2>
                                Financial Summary
                            </h2>

                            <p>
                                Your monthly financial limits
                            </p>

                        </div>

                    </div>


                    <div className="financial-summary">


                        <div className="financial-box">

                            <span>
                                Monthly Income
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    profile.monthlyIncome
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div className="financial-box">

                            <span>
                                Monthly Budget
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    profile.monthlyBudget
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div className="financial-box">

                            <span>
                                Budget Difference
                            </span>

                            <strong>

                                ₹
                                {(
                                    Number(
                                        profile.monthlyIncome
                                    ) -
                                    Number(
                                        profile.monthlyBudget
                                    )
                                ).toLocaleString("en-IN")}

                            </strong>

                        </div>


                    </div>


                </div>


            </div>


        </div>

    </AppShell>

    );

}


export default Profile;
