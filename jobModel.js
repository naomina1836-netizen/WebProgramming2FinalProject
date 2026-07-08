const db = require("../config/db");

const createJob = async (jobData) => {
    const { company_id, title, description, location, job_type, deadline } = jobData;
    
    const [result] = await db.query(
        `INSERT INTO jobs 
         (company_id, title, description, location, job_type, deadline) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [company_id, title, description, location, job_type, deadline]
    );
    
    return result.insertId;
};

const getJobsByCompany = async (companyId) => {
    try {
        const [rows] = await db.query(
            `SELECT j.*, 
                    c.company_name,
                    c.location as company_location
             FROM jobs j
             LEFT JOIN companies c ON j.company_id = c.id
             WHERE j.company_id = ?
             ORDER BY j.created_at DESC`,
            [companyId]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

const updateJob = async (id, jobData) => {
    const { title, description, location, job_type, deadline } = jobData;
    
    const [result] = await db.query(
        `UPDATE jobs 
         SET title = ?, 
             description = ?, 
             location = ?, 
             job_type = ?, 
             deadline = ?
         WHERE id = ?`,
        [title, description, location, job_type, deadline, id]
    );
    
    return result.affectedRows;
};

const deleteJob = async (id) => {
    const [result] = await db.query(
        "DELETE FROM jobs WHERE id = ?",
        [id]
    );
    return result.affectedRows;
};

const getAllJobs = async () => {
    const [rows] = await db.query(
        `SELECT j.*, 
                c.company_name,
                c.location as company_location
         FROM jobs j
         LEFT JOIN companies c ON j.company_id = c.id
         ORDER BY j.created_at DESC`
    );
    return rows;
};

const searchJobs = async (keyword) => {
    const [rows] = await db.query(
        `SELECT j.*, 
                c.company_name,
                c.location as company_location
         FROM jobs j
         LEFT JOIN companies c ON j.company_id = c.id
         WHERE j.title LIKE ? 
            OR j.description LIKE ? 
            OR j.location LIKE ?
         ORDER BY j.created_at DESC`,
        [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
};

const getJobById = async (id) => {
    const [rows] = await db.query(
        `SELECT j.*, 
                c.company_name,
                c.location as company_location
         FROM jobs j
         LEFT JOIN companies c ON j.company_id = c.id
         WHERE j.id = ?`,
        [id]
    );
    return rows[0];
};

module.exports = {
    createJob,
    getJobsByCompany,
    updateJob,
    deleteJob,
    getAllJobs,
    searchJobs,
    getJobById
};