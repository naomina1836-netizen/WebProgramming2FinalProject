const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        console.log("=== REGISTER USER ===");
        console.log("Request body:", req.body);

        const { name, email, password, role, phone, location } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        // Check if user already exists
        const [existing] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "User with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO users 
             (name, email, password, role, phone, location) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, role || "job_seeker", phone || null, location || null]
        );

        res.status(201).json({
            message: "User registered successfully.",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Failed to register user.",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("=== LOGIN USER ===");
        console.log("Email:", req.body.email);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        delete user.password;

        res.json({
            message: "Login successful.",
            token,
            user
        });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            message: "Failed to login.",
            error: error.message
        });
    }
};