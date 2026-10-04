const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, recordController.createRecord);
router.get("/", authMiddleware, recordController.getRecords);
router.put("/:id", authMiddleware, recordController.updateRecord);
router.delete("/:id", authMiddleware, recordController.deleteRecord);

module.exports = router;
