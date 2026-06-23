const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(400)
			.json({ error: "Email and password are required." });
	}

	try {
		const result = await pool.query(
			"SELECT * FROM system_users WHERE email = $1",
			[email],
		);

		const user = result.rows[0];

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials." });
		}

		const valid = await bcrypt.compare(password, user.password_hash);

		if (!valid) {
			return res.status(401).json({ error: "Invalid credentials." });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" },
		);

		res.json({ token, role: user.role, email: user.email });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Login failed." });
	}
};

module.exports = { login };
