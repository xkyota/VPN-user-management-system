require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./db");

const seed = async () => {
	const hash = await bcrypt.hash("admin123", 10);
	await pool.query(
		`INSERT INTO system_users (email, password_hash, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING`,
		["admin@vpn.local", hash, "admin"],
	);
	console.log("Admin created: admin@vpn.local / admin123");
	process.exit(0);
};

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
