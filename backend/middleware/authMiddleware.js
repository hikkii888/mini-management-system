const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.authMiddleware = (req, res, next) => {
    const authorization = req.header("Authorization");
    const match = authorization && /^Bearer\s+(.+)$/i.exec(authorization);

    if (!match) {
        return next(new AppError("A valid bearer token is required", 401));
    }

    try {
        const decoded = jwt.verify(match[1], process.env.JWT_SECRET);
        if (
            !decoded ||
            typeof decoded !== "object" ||
            !decoded.userId ||
            (decoded.role !== undefined && !["admin", "user"].includes(decoded.role))
        ) {
            return next(new AppError("Invalid token", 401));
        }

        req.user = {
            ...decoded,
            role: decoded.role || "user"
        };
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid token", 401));
        }
        next(error);
    }
};
