const usersRoutes = require("./routes/users");
const activityLogsRoutes = require("./routes/activityLogs");
const authRoutes = require("./routes/auth");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const { requireAuth } = require("./middleware/requireAuth");

const app = express();

app.use(cors());
app.use(express.json());

// Public
app.use("/api/auth", authRoutes);

// Protected
app.use("/api/users", requireAuth, usersRoutes);
app.use("/api/activity-logs", requireAuth, activityLogsRoutes);

app.get("/api/health", (req, res) => {
	res.json({
		status: "OK",
		message: "VPN User Management System backend is running",
	});
});

app.get("/api/db-test", async (req, res) => {
	try {
		const result = await pool.query("SELECT NOW()");
		res.json({
			status: "OK",
			message: "Database connection successful",
			time: result.rows[0].now,
		});
	} catch (error) {
		res.status(500).json({
			status: "ERROR",
			message: "Database connection failed",
			error: error.message,
		});
	}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
