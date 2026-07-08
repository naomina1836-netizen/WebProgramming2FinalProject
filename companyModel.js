const db = require("../config/db");

async function createCompany(companyData) {
    const {
        owner_id,
        company_name,
        description,
        location,
        website
    } = companyData;

    const [result] = await db.query(
        `INSERT INTO companies
        (owner_id, company_name, description, location, website)
        VALUES (?, ?, ?, ?, ?)`,
        [
            owner_id,
            company_name,
            description,
            location,
            website
        ]
    );

    return result.insertId;
}

async function getCompanyByOwner(ownerId) {
    const [rows] = await db.query(
        "SELECT * FROM companies WHERE owner_id = ?",
        [ownerId]
    );

    return rows[0] || null;
}


async function updateCompany(ownerId, companyData) {
    const {
        company_name,
        description,
        location,
        website
    } = companyData;

    const [result] = await db.query(
        `
        UPDATE companies
        SET
            company_name = ?,
            description = ?,
            location = ?,
            website = ?
        WHERE owner_id = ?
        `,
        [
            company_name,
            description,
            location,
            website,
            ownerId
        ]
    );

    return result.affectedRows;
}


module.exports = {
    createCompany,
    getCompanyByOwner,
    updateCompany  
};