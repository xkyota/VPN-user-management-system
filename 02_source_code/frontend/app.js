const usersTableBody = document.getElementById("usersTableBody");
const loadUsersBtn = document.getElementById("loadUsersBtn");
const createUserForm = document.getElementById("createUserForm");
const formMessage = document.getElementById("formMessage");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const vpnUsernameInput = document.getElementById("vpnUsername");
const statusInput = document.getElementById("status");
const expiryDateInput = document.getElementById("expiryDate");

const API_URL = "http://localhost:3000/api/users";

let editingUserId = null;

const loadUsers = async () => {
	try {
		const response = await fetch(API_URL);
		const users = await response.json();

		usersTableBody.innerHTML = "";

		if (users.length === 0) {
			usersTableBody.innerHTML = `
        <tr>
          <td colspan="7">No VPN users found.</td>
        </tr>
      `;
			return;
		}

		users.forEach((user) => {
			const row = document.createElement("tr");

			row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.full_name}</td>
        <td>${user.email}</td>
        <td>${user.vpn_username}</td>
        <td>${user.status}</td>
        <td>${new Date(user.expiry_date).toLocaleDateString()}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

			usersTableBody.appendChild(row);

			const editButton = row.querySelector(".edit-btn");
			const deleteButton = row.querySelector(".delete-btn");

			editButton.addEventListener("click", () => {
				startEditUser(user);
			});

			deleteButton.addEventListener("click", () => {
				deleteUser(user.id);
			});
		});
	} catch (error) {
		usersTableBody.innerHTML = `
      <tr>
        <td colspan="7">Failed to load users.</td>
      </tr>
    `;

		console.error("Failed to load users:", error);
	}
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
			alert(data.message || "Failed to delete user.");
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

loadUsers();
