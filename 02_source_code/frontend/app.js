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

const logsTableBody = document.getElementById("logsTableBody");
const loadLogsBtn = document.getElementById("loadLogsBtn");

const API_URL = "http://localhost:3000/api/users";
const LOGS_URL = "http://localhost:3000/api/activity-logs";

let editingUserId = null;
let allUsers = [];

const loadUsers = async () => {
	try {
		const response = await fetch(API_URL);
		const users = await response.json();

		if (!response.ok) {
			usersTableBody.innerHTML = `
        <tr>
          <td colspan="7">Failed to load users.</td>
        </tr>
      `;
			return;
		}

		allUsers = users;
		updateDashboard();
		renderUsers();
	} catch (error) {
		usersTableBody.innerHTML = `
      <tr>
        <td colspan="7">Failed to connect to backend.</td>
      </tr>
    `;

		console.error("Failed to load users:", error);
	}
};

const updateDashboard = () => {
	const totalUsers = allUsers.length;

	const activeUsers = allUsers.filter(
		(user) => user.status === "active",
	).length;
	const inactiveUsers = allUsers.filter(
		(user) => user.status === "inactive",
	).length;
	const expiredUsers = allUsers.filter(
		(user) => user.status === "expired",
	).length;

	totalUsersElement.textContent = totalUsers;
	activeUsersElement.textContent = activeUsers;
	inactiveUsersElement.textContent = inactiveUsers;
	expiredUsersElement.textContent = expiredUsers;
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
		usersTableBody.innerHTML = `
      <tr>
        <td colspan="7">No VPN users found.</td>
      </tr>
    `;
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

		const viewButton = row.querySelector(".view-btn");
		const editButton = row.querySelector(".edit-btn");
		const deleteButton = row.querySelector(".delete-btn");

		viewButton.addEventListener("click", () => {
			showUserDetails(user);
		});

		editButton.addEventListener("click", () => {
			startEditUser(user);
		});

		deleteButton.addEventListener("click", () => {
			deleteUser(user.id);
		});
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
      <p><strong>Expiry date:</strong> ${new Date(
			user.expiry_date,
		).toLocaleDateString()}</p>
      <p><strong>Created at:</strong> ${new Date(
			user.created_at,
		).toLocaleString()}</p>
      <p><strong>Updated at:</strong> ${new Date(
			user.updated_at,
		).toLocaleString()}</p>
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

	const submitButton = createUserForm.querySelector("button[type='submit']");
	submitButton.textContent = "Update User";
};

const resetFormMode = () => {
	editingUserId = null;
	createUserForm.reset();

	const submitButton = createUserForm.querySelector("button[type='submit']");
	submitButton.textContent = "Create User";
};

const deleteUser = async (id) => {
	const confirmed = confirm("Are you sure you want to delete this VPN user?");

	if (!confirmed) {
		return;
	}

	try {
		const response = await fetch(`${API_URL}/${id}`, {
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
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
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

loadUsers();

const getBadgeClass = (action) => {
	if (action.includes("created")) return "badge-created";
	if (action.includes("updated")) return "badge-updated";
	if (action.includes("deleted")) return "badge-deleted";
	return "";
};

const loadLogs = async () => {
	try {
		const response = await fetch(LOGS_URL);
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
