// ─── Auth helpers ───────────────────────────────────────────────

const getToken = () => localStorage.getItem("token");

const authFetch = (url, options = {}) => {
	return fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
			...(options.headers || {}),
		},
	});
};

// ─── Pages ──────────────────────────────────────────────────────

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const headerUserEmail = document.getElementById("headerUserEmail");
const headerUserRole = document.getElementById("headerUserRole");

const showApp = (email, role) => {
	loginPage.classList.add("hidden");
	appPage.classList.remove("hidden");
	headerUserEmail.textContent = email;
	headerUserRole.textContent = role;
	loadUsers();
};

const showLogin = () => {
	appPage.classList.add("hidden");
	loginPage.classList.remove("hidden");
};

// ─── Login ──────────────────────────────────────────────────────

const loginBtn = document.getElementById("loginBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", async () => {
	loginError.textContent = "";

	try {
		const response = await fetch("http://localhost:3000/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: loginEmail.value,
				password: loginPassword.value,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			loginError.textContent = data.error || "Login failed.";
			return;
		}

		localStorage.setItem("token", data.token);
		localStorage.setItem("userEmail", data.email);
		localStorage.setItem("userRole", data.role);

		showApp(data.email, data.role);
	} catch (error) {
		loginError.textContent = "Failed to connect to backend.";
		console.error("Login error:", error);
	}
});

// Allow Enter key on login
loginPassword.addEventListener("keydown", (e) => {
	if (e.key === "Enter") loginBtn.click();
});

// ─── Logout ─────────────────────────────────────────────────────

document.getElementById("logoutBtn").addEventListener("click", () => {
	localStorage.removeItem("token");
	localStorage.removeItem("userEmail");
	localStorage.removeItem("userRole");
	loginEmail.value = "";
	loginPassword.value = "";
	showLogin();
});

// ─── Users ──────────────────────────────────────────────────────

const usersTableBody = document.getElementById("usersTableBody");
const loadUsersBtn = document.getElementById("loadUsersBtn");
const createUserForm = document.getElementById("createUserForm");
const formMessage = document.getElementById("formMessage");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const vpnUsernameInput = document.getElementById("vpnUsername");
const statusInput = document.getElementById("status");
const expiryDateInput = document.getElementById("expiryDate");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalUsersElement = document.getElementById("totalUsers");
const activeUsersElement = document.getElementById("activeUsers");
const inactiveUsersElement = document.getElementById("inactiveUsers");
const expiredUsersElement = document.getElementById("expiredUsers");

const userDetailsContent = document.getElementById("userDetailsContent");

const API_URL = "http://localhost:3000/api/users";

let editingUserId = null;
let allUsers = [];

const loadUsers = async () => {
	try {
		const response = await authFetch(API_URL);

		if (response.status === 401) {
			localStorage.removeItem("token");
			showLogin();
			return;
		}

		const users = await response.json();

		if (!response.ok) {
			usersTableBody.innerHTML = `<tr><td colspan="7">Failed to load users.</td></tr>`;
			return;
		}

		allUsers = users;
		updateDashboard();
		renderUsers();
	} catch (error) {
		usersTableBody.innerHTML = `<tr><td colspan="7">Failed to connect to backend.</td></tr>`;
		console.error("Failed to load users:", error);
	}
};

const updateDashboard = () => {
	totalUsersElement.textContent = allUsers.length;
	activeUsersElement.textContent = allUsers.filter(
		(u) => u.status === "active",
	).length;
	inactiveUsersElement.textContent = allUsers.filter(
		(u) => u.status === "inactive",
	).length;
	expiredUsersElement.textContent = allUsers.filter(
		(u) => u.status === "expired",
	).length;
};

const renderUsers = () => {
	const searchValue = searchInput.value.toLowerCase();
	const selectedStatus = statusFilter.value;

	const filteredUsers = allUsers.filter((user) => {
		const matchesSearch =
			user.full_name.toLowerCase().includes(searchValue) ||
			user.email.toLowerCase().includes(searchValue) ||
			user.vpn_username.toLowerCase().includes(searchValue);

		const matchesStatus =
			selectedStatus === "all" || user.status === selectedStatus;

		return matchesSearch && matchesStatus;
	});

	usersTableBody.innerHTML = "";

	if (filteredUsers.length === 0) {
		usersTableBody.innerHTML = `<tr><td colspan="7">No VPN users found.</td></tr>`;
		return;
	}

	filteredUsers.forEach((user) => {
		const row = document.createElement("tr");

		row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.vpn_username}</td>
            <td>${user.status}</td>
            <td>${new Date(user.expiry_date).toLocaleDateString()}</td>
            <td>
                <button class="view-btn">View</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

		usersTableBody.appendChild(row);

		row.querySelector(".view-btn").addEventListener("click", () =>
			showUserDetails(user),
		);
		row.querySelector(".edit-btn").addEventListener("click", () =>
			startEditUser(user),
		);
		row.querySelector(".delete-btn").addEventListener("click", () =>
			deleteUser(user.id),
		);
	});
};

const showUserDetails = (user) => {
	userDetailsContent.innerHTML = `
        <div class="details-card">
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Full name:</strong> ${user.full_name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>VPN username:</strong> ${user.vpn_username}</p>
            <p><strong>Status:</strong> ${user.status}</p>
            <p><strong>Expiry date:</strong> ${new Date(user.expiry_date).toLocaleDateString()}</p>
            <p><strong>Created at:</strong> ${new Date(user.created_at).toLocaleString()}</p>
            <p><strong>Updated at:</strong> ${new Date(user.updated_at).toLocaleString()}</p>
        </div>
    `;
};

const startEditUser = (user) => {
	editingUserId = user.id;
	fullNameInput.value = user.full_name;
	emailInput.value = user.email;
	vpnUsernameInput.value = user.vpn_username;
	statusInput.value = user.status;
	expiryDateInput.value = user.expiry_date.split("T")[0];
	formMessage.textContent = `Editing user ID: ${user.id}`;
	createUserForm.querySelector("button[type='submit']").textContent =
		"Update User";
};

const resetFormMode = () => {
	editingUserId = null;
	createUserForm.reset();
	createUserForm.querySelector("button[type='submit']").textContent =
		"Create User";
};

const deleteUser = async (id) => {
	if (!confirm("Are you sure you want to delete this VPN user?")) return;

	try {
		const response = await authFetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});
		const data = await response.json();

		if (!response.ok) {
			alert(data.message || data.error || "Failed to delete user.");
			return;
		}

		alert("VPN user deleted successfully.");
		loadUsers();
	} catch (error) {
		alert("Failed to connect to backend.");
		console.error("Delete user error:", error);
	}
};

createUserForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const userData = {
		full_name: fullNameInput.value,
		email: emailInput.value,
		vpn_username: vpnUsernameInput.value,
		status: statusInput.value,
		expiry_date: expiryDateInput.value,
	};

	const url = editingUserId ? `${API_URL}/${editingUserId}` : API_URL;
	const method = editingUserId ? "PUT" : "POST";

	try {
		const response = await authFetch(url, {
			method,
			body: JSON.stringify(userData),
		});

		const data = await response.json();

		if (!response.ok) {
			formMessage.textContent =
				data.error || data.message || "Failed to save user.";
			return;
		}

		formMessage.textContent = editingUserId
			? "VPN user updated successfully."
			: "VPN user created successfully.";

		resetFormMode();
		loadUsers();
	} catch (error) {
		formMessage.textContent = "Failed to connect to backend.";
		console.error("Save user error:", error);
	}
});

loadUsersBtn.addEventListener("click", loadUsers);
searchInput.addEventListener("input", renderUsers);
statusFilter.addEventListener("change", renderUsers);

// ─── Activity Logs ───────────────────────────────────────────────

const logsTableBody = document.getElementById("logsTableBody");
const loadLogsBtn = document.getElementById("loadLogsBtn");
const LOGS_URL = "http://localhost:3000/api/activity-logs";

const getBadgeClass = (action) => {
	if (action.includes("created")) return "badge-created";
	if (action.includes("updated")) return "badge-updated";
	if (action.includes("deleted")) return "badge-deleted";
	return "";
};

const loadLogs = async () => {
	try {
		const response = await authFetch(LOGS_URL);
		const logs = await response.json();

		if (!response.ok) {
			logsTableBody.innerHTML = `<tr><td colspan="4">Failed to load logs.</td></tr>`;
			return;
		}

		if (logs.length === 0) {
			logsTableBody.innerHTML = `<tr><td colspan="4">No activity logs found.</td></tr>`;
			return;
		}

		logsTableBody.innerHTML = "";

		logs.forEach((log) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${log.id}</td>
                <td><span class="badge ${getBadgeClass(log.action)}">${log.action}</span></td>
                <td>${log.description}</td>
                <td class="log-time">${new Date(log.created_at).toLocaleString()}</td>
            `;
			logsTableBody.appendChild(row);
		});
	} catch (error) {
		logsTableBody.innerHTML = `<tr><td colspan="4">Failed to connect to backend.</td></tr>`;
		console.error("Load logs error:", error);
	}
};

loadLogsBtn.addEventListener("click", loadLogs);

// ─── Init ───────────────────────────────────────────────────────

const token = getToken();
if (token) {
	showApp(
		localStorage.getItem("userEmail"),
		localStorage.getItem("userRole"),
	);
} else {
	showLogin();
}
