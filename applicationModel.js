const db = require("../config/db");

async function apply(userId, jobId) {
    const [result] = await db.query(
        `
        INSERT INTO applications
        (user_id, job_id)
        VALUES (?,?)
        `,
        [
            userId,
            jobId
        ]
    );
    return result.insertId;
}

async function alreadyApplied(userId, jobId) {
    const [rows] = await db.query(
        `
        SELECT *
        FROM applications
        WHERE
            user_id=?
            AND job_id=?
        `,
        [
            userId,
            jobId
        ]
    );
    return rows.length > 0;
}

async function getApplications(userId) {
    const [rows] = await db.query(
        `
        SELECT
            applications.*,
            jobs.title,
            companies.company_name
        FROM applications
        JOIN jobs
            ON applications.job_id = jobs.id
        JOIN companies
            ON jobs.company_id = companies.id
        WHERE applications.user_id = ?
        ORDER BY applications.applied_at DESC
        `,
        [
            userId
        ]
    );
    return rows;
}

async function getApplicationsByJob(jobId) {
    const [rows] = await db.query(
        `
        SELECT
            applications.id,
            applications.status,
            applications.applied_at,
            users.full_name,
            users.email
        FROM applications
        JOIN users
            ON applications.user_id = users.id
        WHERE applications.job_id = ?
        ORDER BY applications.applied_at DESC
        `,
        [jobId]
    );
    return rows;
}

async function updateApplicationStatus(applicationId, status) {
    const [result] = await db.query(
        `
        UPDATE applications
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            applicationId
        ]
    );
    return result.affectedRows;
}

async function getApplicantsByCompany(ownerId) {
    const [rows] = await db.query(
        `
        SELECT
            applications.id,
            applications.status,
            applications.applied_at,

            users.id AS user_id,
            users.full_name,
            users.email,

            jobs.id AS job_id,
            jobs.title,

            resumes.file_path

        FROM applications

        JOIN jobs
            ON applications.job_id = jobs.id

        JOIN companies
            ON jobs.company_id = companies.id

        JOIN users
            ON applications.user_id = users.id

        LEFT JOIN resumes
            ON resumes.user_id = users.id

        WHERE companies.owner_id = ?

        ORDER BY applications.applied_at DESC
        `,
        [ownerId]
    );

    return rows;
}

module.exports = {
    apply,
    alreadyApplied,
    getApplications,
    getApplicationsByJob,
    updateApplicationStatus,
    getApplicantsByCompany
};