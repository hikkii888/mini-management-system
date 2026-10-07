const AppError = require("../utils/AppError");

exports.notFound = (req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
    let status = err.statusCode || 500;
    let message = err.message;
    let errors = err.errors || null;

    if (err.name === "CastError") {
        status = 400;
        message = "Invalid id";
    } else if (err.name === "ValidationError" && err.errors) {
        status = 400;
        message = "Validation failed";
        errors = Object.values(err.errors).map((e) => e.message);
    } else if (err.type === "entity.parse.failed") {
        status = 400;
        message = "Invalid JSON body";
    } else if (err.code === 11000) {
        status = 400;
        message = "Duplicate value";
    }

    if (status >= 500) {
        console.error(err);
        message = "Server error"; // do not leak internals
    }

    res.status(status).json({
        message,
        ...(errors && { errors })
    });
};
