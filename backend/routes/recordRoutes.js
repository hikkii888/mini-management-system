const express = require("express");

const router = express.Router();

const recordController = require("../controllers/recordController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/",
    authMiddleware,
    recordController.createRecord
);

router.get(
    "/",
    authMiddleware,
    recordController.getRecords
);

module.exports = router;