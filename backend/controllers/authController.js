const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= REGISTER USER =================
const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;

    console.log("Registration data:", req.body);

    // Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Validate role
    if (!["guide", "member"].includes(role)) {
        return res.status(400).json({
            message: "Invalid role selected"
        });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({
                message: "Error hashing password"
            });
        }

        // Insert user into database with selected role
        const sql =
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(
            sql,
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already registered"
                        });
                    }

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "User registered successfully"
                });
            }
        );
    });
};

// ================= LOGIN USER =================
const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Find user by email
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        // Check whether user exists
        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        // Compare entered password with hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    message: "Error verifying password"
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // Generate JWT token with actual database role
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                "teamtrack_secret_key",
                { expiresIn: "1h" }
            );

            // Send user details and token to frontend
            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    });
};

module.exports = {
    registerUser,
    loginUser
};
