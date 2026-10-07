const express = require("express");
const router = express.Router();
const recordController = require("../controllers/recordController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateRecord, validateRecordSearch } = require("../middleware/validate");

router.post("/", authMiddleware, validateRecord(), recordController.createRecord);
router.get("/", authMiddleware, validateRecordSearch, recordController.getRecords);
router.put("/:id", authMiddleware, validateRecord({ partial: true }), recordController.updateRecord);
router.delete("/:id", authMiddleware, recordController.deleteRecord);

module.exports = router;
