const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.me = async (req, res) => {
    try {
        console.log("=== GET USER PROFILE ===");
        console.log("User ID:", req.user.id);

        const [users] = await db.query(
            `SELECT id, name, email, phone, location, bio, skills, role, resume_url, created_at 
             FROM users WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(users[0]);

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            message: "Failed to fetch user.",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        console.log("=== UPDATE USER PROFILE ===");
        console.log("User ID:", req.user.id);

        const { name, email, phone, location, bio, skills, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [users] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (email) {
            const [existing] = await db.query(
                "SELECT id FROM users WHERE email = ? AND id != ?",
                [email, userId]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    message: "Email already in use."
                });
            }
        }

        let updateQuery = `
            UPDATE users 
            SET name = ?, 
                email = ?, 
                phone = ?, 
                location = ?, 
                bio = ?,
                skills = ?
        `;
        let params = [name, email, phone || null, location || null, bio || null, skills || null];

        if (newPassword) {
            const user = users[0];
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Current password is incorrect."
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateQuery += ", password = ?";
            params.push(hashedPassword);
        }

        updateQuery += " WHERE id = ?";
        params.push(userId);

        await db.query(updateQuery, params);

        const [updatedUser] = await db.query(
            `SELECT id, name, email, phone, location, bio, skills, role, resume_url, created_at 
             FROM users WHERE id = ?`,
            [userId]
        );

        res.json({
            message: "Profile updated successfully",
            user: updatedUser[0]
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};