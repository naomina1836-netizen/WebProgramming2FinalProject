const db = require("../config/db");
const bcrypt = require("bcryptjs");

async function createUser(userData) {
    const { name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
    );

    return result.insertId;
}

async function findUserByEmail(email) {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0] || null;
}

async function findUserById(userId) {
    const [rows] = await db.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        [userId]
    );
    return rows[0] || null;
}

async function updateUser(id, data) {
    const { name, email, role } = data;
    const [result] = await db.query(
        "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
        [name, email, role, id]
    );
    return result.affectedRows;
}

async function getAllUsers() {
    const [rows] = await db.query(
        "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
}

async function deleteUser(userId) {
    const [result] = await db.query(
        "DELETE FROM users WHERE id = ?",
        [userId]
    );
    return result.affectedRows;
}

async function verifyPassword(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    return user;
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser
};