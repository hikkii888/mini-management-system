const Record = require("../models/Record");

exports.createRecord = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.userId;

        const record = await Record.create({
            title,
            description,
            user: userId
        });

        res.status(201).json({
            message: "Record created successfully",
            record
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getRecords = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { search } = req.query;

        let query = { user: userId };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const records = await Record.find(query).sort({ createdAt: -1 });

        res.json(records);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
