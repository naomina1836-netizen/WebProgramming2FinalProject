const {
    saveResume,
    getResume
} = require("../models/resumeModel");

exports.upload = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Please select a resume."
            });

        }

        await saveResume(
            req.user.id,
            req.file.filename
        );

        res.json({
            message: "Resume uploaded successfully.",
            file: req.file.filename
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Resume upload failed."
        });

    }

};

exports.getMine = async (req, res) => {

    try {

        const resume = await getResume(req.user.id);

        res.json(resume);

    }

    catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};