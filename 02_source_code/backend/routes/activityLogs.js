const express = require("express");
const router = express.Router();

const {
  getActivityLogs,
} = require("../controllers/activityLogsController");

router.get("/", getActivityLogs);

module.exports = router;