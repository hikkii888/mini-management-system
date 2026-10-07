const Record = require("../models/Record");

exports.createRecord = async (req, res) => {
    try {
        const { title, description } = req.body;

        const record = await Record.create({
            title,
            description,
            user: req.userId
        });

        res.status(201).json(record);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create record"
        });
    }
};