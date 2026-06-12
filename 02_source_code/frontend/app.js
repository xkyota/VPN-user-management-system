const usersTableBody = document.getElementById("usersTableBody");
const loadUsersBtn = document.getElementById("loadUsersBtn");
const createUserForm = document.getElementById("createUserForm");
const formMessage = document.getElementById("formMessage");

const API_URL = "http://localhost:3000/api/users";

const loadUsers = async () => {
	try {
		const response = await fetch(API_URL);
		const users = await response.json();

		usersTableBody.innerHTML = "";

		if (users.length === 0) {
			usersTableBody.innerHTML = `
        <tr>
          <td colspan="6">No VPN users found.</td>
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
   					<button class="delete-btn" data-id="${user.id}">Delete</button>
				</td>
`;

			usersTableBody.appendChild(row);

			const deleteButton = row.querySelector(".delete-btn");

			deleteButton.addEventListener("click", () => {
				deleteUser(user.id);
			});
		});
	} catch (error) {
		usersTableBody.innerHTML = `
      <tr>
        <td colspan="6">Failed to load users.</td>
      </tr>
    `;

		console.error("Failed to load users:", error);
	}
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

loadUsersBtn.addEventListener("click", loadUsers);

createUserForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const newUser = {
		full_name: document.getElementById("fullName").value,
		email: document.getElementById("email").value,
		vpn_username: document.getElementById("vpnUsername").value,
		status: document.getElementById("status").value,
		expiry_date: document.getElementById("expiryDate").value,
	};

	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newUser),
		});

		const data = await response.json();

		if (!response.ok) {
			formMessage.textContent =
				data.error || data.message || "Failed to create user.";
			return;
		}

		formMessage.textContent = "VPN user created successfully.";
		createUserForm.reset();
		loadUsers();
	} catch (error) {
		if (error.code === "23505") {
			return res.status(409).json({
				message: "Email or VPN username already exists",
			});
		}

		res.status(500).json({
			message: "Failed to create user",
			error: error.message,
		});
	}
});
