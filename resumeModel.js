const db = require("../config/db");

async function saveResume(userId, filename) {

    const [existing] = await db.query(

        "SELECT * FROM resumes WHERE user_id=?",

        [userId]

    );

    if (existing.length > 0) {

        await db.query(

            "UPDATE resumes SET file_path=? WHERE user_id=?",

            [filename, userId]

        );

        return;
    }

    await db.query(

        `

        INSERT INTO resumes

        (user_id,file_path)

        VALUES (?,?)

        `,

        [

            userId,

            filename

        ]

    );

}

async function getResume(userId) {

    const [rows] = await db.query(

        "SELECT * FROM resumes WHERE user_id=?",

        [userId]

    );

    return rows[0];

}

module.exports = {

    saveResume,

    getResume

};