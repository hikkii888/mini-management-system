const Record = require("../models/Record");
const AppError = require("../utils/AppError");

exports.createRecord = async (req, res, next) => {
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
        next(error);
    }
};

exports.getRecords = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { search } = req.query;

        const query = req.user.role === "admin" ? {} : { user: userId };

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query.$or = [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } }
            ];
        }

        const records = await Record.find(query).sort({ createdAt: -1 });

        res.json(records);

    } catch (error) {
        next(error);
    }
};

// Owner or admin only
const canModify = (record, user) => {
    return user.role === "admin" || String(record.user) === String(user.userId);
};

exports.updateRecord = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) throw new AppError("Record not found", 404);
        if (!canModify(record, req.user)) throw new AppError("You are not allowed to edit this record", 403);

        // req.body was whitelisted and trimmed by validateRecord
        Object.assign(record, req.body);
        await record.save();

        res.json({
            message: "Record updated successfully",
            record
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) throw new AppError("Record not found", 404);
        if (!canModify(record, req.user)) throw new AppError("You are not allowed to delete this record", 403);

        await record.deleteOne();

        res.json({
            message: "Record deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};
