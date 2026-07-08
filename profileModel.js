const db = require("../config/db");

async function getUser(id) {

    const [rows] = await db.query(

        `
        SELECT
            id,
            full_name,
            email,
            role,
            phone,
            location,
            bio,
            skills
        FROM users
        WHERE id=?
        `,
        [id]

    );

    return rows[0];

}

async function updateUser(id,data){

    const {

        full_name,
        email,
        phone,
        location,
        bio,
        skills

    } = data;

    await db.query(

        `
        UPDATE users
        SET

        full_name=?,
        email=?,
        phone=?,
        location=?,
        bio=?,
        skills=?

        WHERE id=?

        `,

        [

            full_name,
            email,
            phone,
            location,
            bio,
            skills,
            id

        ]

    );

}

module.exports={

    getUser,
    updateUser

};