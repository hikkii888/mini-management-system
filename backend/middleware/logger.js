const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "logs");
fs.mkdirSync(logDir, { recursive: true });
const logStream = fs.createWriteStream(path.join(logDir, "api.log"), { flags: "a" });

logStream.on("error", (error) => {
    console.error("API request log write failed:", error.message);
});

module.exports = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logStream.write(JSON.stringify({
            time: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            userId: req.user ? req.user.userId : null
        }) + "\n");

        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
};
