const pool = require("../db");

const getActivityLogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_logs ORDER BY created_at DESC, id DESC LIMIT 50"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get activity logs",
      error: error.message,
    });
  }
};

module.exports = {
  getActivityLogs,
};