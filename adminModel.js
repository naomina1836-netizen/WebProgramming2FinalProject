const db = require("../config/db");

async function getStatistics() {

    const [[users]] = await db.query(
        "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[companies]] = await db.query(
        "SELECT COUNT(*) AS totalCompanies FROM companies"
    );

    const [[jobs]] = await db.query(
        "SELECT COUNT(*) AS totalJobs FROM jobs"
    );

    const [[applications]] = await db.query(
        "SELECT COUNT(*) AS totalApplications FROM applications"
    );

    return {
        users: users.totalUsers,
        companies: companies.totalCompanies,
        jobs: jobs.totalJobs,
        applications: applications.totalApplications
    };

}

async function getUsers() {

    const [rows] = await db.query(`
        SELECT
            id,
            full_name,
            email,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return rows;

}

async function getCompanies() {

    const [rows] = await db.query(`
        SELECT *
        FROM companies
        ORDER BY created_at DESC
    `);

    return rows;

}

async function getJobs() {

    const [rows] = await db.query(`
        SELECT
            jobs.*,
            companies.company_name
        FROM jobs
        JOIN companies
        ON jobs.company_id = companies.id
        ORDER BY jobs.created_at DESC
    `);

    return rows;

}

async function deleteUser(id) {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
}

async function deleteJob(id) {
    await db.query("DELETE FROM jobs WHERE id = ?", [id]);
}

module.exports = {
    getStatistics,
    getUsers,
    getCompanies,
    getJobs,
    deleteUser,
    deleteJob
};