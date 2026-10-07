const AppError = require("../utils/AppError");

// Usage: router.get("/admin-only", authMiddleware, authorize("admin"), handler)
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError("Access denied: insufficient permissions", 403));
        }
        next();
    };
};
