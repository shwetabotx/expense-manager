const User = require("../models/User");


// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {

    try {

        const userId = req.user.userId;

        const user = await User.findById(userId)
            .select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }


        res.status(200).json({

            success: true,

            data: {

                id: user._id,

                name: user.name,

                email: user.email,

                monthlyIncome:
                    user.monthlyIncome || 0,

                monthlyBudget:
                    user.monthlyBudget || 0,

                createdAt: user.createdAt

            }

        });


    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to load profile"

        });

    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            name,
            monthlyIncome,
            monthlyBudget
        } = req.body;


        // Name validation

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message: "Name is required"

            });

        }


        // Convert values to numbers

        const income = Number(monthlyIncome);

        const budget = Number(monthlyBudget);


        // Income validation

        if (
            !Number.isFinite(income) ||
            income < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Monthly income must be a valid number"

            });

        }


        // Budget validation

        if (
            !Number.isFinite(budget) ||
            budget < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Monthly budget must be a valid number"

            });

        }


        // Update user

        const user = await User.findByIdAndUpdate(

            userId,

            {

                name: name.trim(),

                monthlyIncome: income,

                monthlyBudget: budget

            },

            {

                new: true,

                runValidators: true

            }

        ).select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        // Response

        res.status(200).json({

            success: true,

            message: "Profile updated successfully",

            data: {

                id: user._id,

                name: user.name,

                email: user.email,

                monthlyIncome:
                    user.monthlyIncome,

                monthlyBudget:
                    user.monthlyBudget

            }

        });


    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Failed to update profile"

        });

    }

};


module.exports = {

    getProfile,
    updateProfile

};