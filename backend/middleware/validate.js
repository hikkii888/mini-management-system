const AppError = require("../utils/AppError");

const isFilledString = (value, max = 255) => {
    return typeof value === "string" && value.trim().length > 0 && value.length <= max;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateRegister = (req, res, next) => {
    const { name, email, password } = req.body || {};
    const errors = [];

    if (!isFilledString(name, 100)) errors.push("name is required (max 100 characters)");
    if (!isFilledString(email, 254) || !EMAIL_REGEX.test(email.trim())) errors.push("a valid email is required");
    if (typeof password !== "string" || password.length < 6) {
        errors.push("password must be at least 6 characters");
    } else if (Buffer.byteLength(password, "utf8") > 72) {
        errors.push("password must not exceed 72 UTF-8 bytes");
    }

    if (errors.length) return next(new AppError("Validation failed", 400, errors));

    // whitelist fields so a client can never set its own role
    req.body = { name: name.trim(), email: email.trim().toLowerCase(), password };
    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};
    const errors = [];

    if (!isFilledString(email, 254) || !EMAIL_REGEX.test(email.trim())) {
        errors.push("a valid email is required");
    }
    if (typeof password !== "string" || password.length === 0) errors.push("password is required");

    if (errors.length) return next(new AppError("Validation failed", 400, errors));

    req.body = { email: email.trim().toLowerCase(), password };
    next();
};

// partial = true for updates (at least one field, but any field given must be valid)
exports.validateRecord = ({ partial = false } = {}) => {
    return (req, res, next) => {
        const { title, description } = req.body || {};
        const errors = [];

        if (!partial || title !== undefined) {
            if (!isFilledString(title, 255)) errors.push("title is required (max 255 characters)");
        }
        if (!partial || description !== undefined) {
            if (!isFilledString(description, 2000)) errors.push("description is required (max 2000 characters)");
        }
        if (partial && title === undefined && description === undefined) {
            errors.push("provide at least one field to update (title or description)");
        }

        if (errors.length) return next(new AppError("Validation failed", 400, errors));

        req.body = {
            ...(title !== undefined && { title: title.trim() }),
            ...(description !== undefined && { description: description.trim() })
        };
        next();
    };
};

exports.validateRecordSearch = (req, res, next) => {
    const { search } = req.query;
    if (search !== undefined && (typeof search !== "string" || search.length > 100)) {
        return next(new AppError("Validation failed", 400, ["search must be a string of at most 100 characters"]));
    }
    next();
};
