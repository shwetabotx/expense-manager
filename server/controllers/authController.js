const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;



// REGISTER


const registerUser = async (req, res) => {

    try {

        const { name, email, password, income, monthlyBudget } = req.body;

        // Required fields

        if (
            !name ||
            !email ||
            !password ||
            monthlyBudget === undefined ||
            monthlyBudget === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        if (income === undefined || Number(income) < 0) {
            return res.status(400).json({
                success: false,
                message: "Income must be a valid number"
            });
        }


        // Validate name

        if (!nameRegex.test(name.trim())) {

            return res.status(400).json({
                success: false,
                message: "Name can contain only alphabets and spaces"
            });

        }


        // Validate email

        if (!emailRegex.test(email.trim())) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });

        }


        // Validate password

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters and contain at least one letter and one number"
            });

        }


        // Validate budget

        const budget = Number(monthlyBudget);

        if (
            !Number.isFinite(budget) ||
            budget < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Monthly budget must be a valid positive number"
            });

        }


        // Check existing email

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user

        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            income: Number(income),
            monthlyBudget: Number(monthlyBudget || 0)
        });


        // Response

        res.status(201).json({

            success: true,

            message: "User registered successfully",

            data: {

                id: user._id,

                name: user.name,

                email: user.email,

                monthlyBudget: user.monthlyBudget

            }

        });


    } catch (error) {

        console.error("Register error:", error);


        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message: "Email already exists"

            });

        }


        if (error.name === "ValidationError") {

            const message = Object.values(error.errors)

                .map((err) => err.message)

                .join(", ");


            return res.status(400).json({

                success: false,

                message

            });

        }


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};



// LOGIN


const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Required fields

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });

        }


        // Find user

        const user = await User.findOne({

            email: email.trim().toLowerCase()

        });


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }


        // Compare password

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });

        }


        // Generate JWT

        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.status(200).json({

            success: true,

            message: "Login successful",

            data: {

                token,

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    monthlyBudget:
                        user.monthlyBudget || 0

                }

            }

        });


    } catch (error) {

        console.error("Login error:", error);


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


module.exports = {

    registerUser,

    loginUser

};