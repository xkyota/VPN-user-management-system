const pool = require("../db");

const createActivityLog = async (action, description) => {
	await pool.query(
		`INSERT INTO activity_logs (action, description)
     VALUES ($1, $2)`,
		[action, description],
	);
};

const getAllUsers = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM vpn_users ORDER BY id ASC",
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({
			message: "Failed to get users",
			error: error.message,
		});
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"SELECT * FROM vpn_users WHERE id = $1",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "VPN user not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({
			message: "Failed to get user",
			error: error.message,
		});
	}
};

const createUser = async (req, res) => {
	try {
		const { full_name, email, vpn_username, status, expiry_date } =
			req.body;

		const result = await pool.query(
			`INSERT INTO vpn_users (full_name, email, vpn_username, status, expiry_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
			[full_name, email, vpn_username, status || "active", expiry_date],
		);

		const createdUser = result.rows[0];

		await createActivityLog(
			"user_created",
			`Created VPN user: ${createdUser.vpn_username}`,
		);

		res.status(201).json(createdUser);
	} catch (error) {
		res.status(500).json({
			message: "Failed to create user",
			error: error.message,
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { full_name, email, vpn_username, status, expiry_date } =
			req.body;

		const result = await pool.query(
			`UPDATE vpn_users
       SET full_name = $1,
           email = $2,
           vpn_username = $3,
           status = $4,
           expiry_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
			[full_name, email, vpn_username, status, expiry_date, id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "VPN user not found" });
		}

		const updatedUser = result.rows[0];

		await createActivityLog(
			"user_updated",
			`Updated VPN user: ${updatedUser.vpn_username}`,
		);

		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update user",
			error: error.message,
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM vpn_users WHERE id = $1 RETURNING *",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "VPN user not found" });
		}

		const deletedUser = result.rows[0];

		await createActivityLog(
			"user_deleted",
			`Deleted VPN user: ${deletedUser.vpn_username}`,
		);

		res.json({
			message: "VPN user deleted successfully",
			deletedUser,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete user",
			error: error.message,
		});
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
};
