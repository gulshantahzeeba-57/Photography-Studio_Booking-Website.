const API_URL = "/bookings";

document.getElementById('todayDate').innerText =
    "System Date: " + new Date().toDateString();

// LOAD DATA
async function loadData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        displayTable(data);
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

// DISPLAY TABLE
function displayTable(data) {
    const tbody = document.getElementById("bookingsTableBody");
    tbody.innerHTML = "";

    data.forEach(b => {
        // b.id ki jagah b._id use kiya hai kyunki MongoDB _id bhejta hai
        tbody.innerHTML += `
        <tr>
            <td><strong>${b.name || 'N/A'}</strong></td>
            <td>${b.date || 'N/A'}</td>
            <td>${b.time || 'N/A'}</td>
            <td><span class="status ${b.status}">${b.status || 'Pending'}</span></td>
            <td class="action-btn">
            <div class="btn-group">
                <button class="action-btn view-btn" onclick="viewDetails('${b._id}')">👁️</button>
                <button class="action-btn approve-btn" onclick="updateStatus('${b._id}','Approved')">✓</button>
                <button class="action-btn delete-btn" onclick="deleteBooking('${b._id}')">✕</button>
                </div>
            </td>
        </tr>`;
    });
}

// UPDATE STATUS (APPROVE)
async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status }) 
        });

        if (response.ok) {
            console.log("Status updated successfully!");
            loadData();
        } else {
            alert("Server didn't accept the update.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

let currentBookingId = null;

async function deleteBooking(id) {
    currentBookingId = id;
    const modal = new bootstrap.Modal(document.getElementById("deletebooking"));
    modal.show();
}

// REJECT / DELETE BOOKING
async function reject() {
    if (!currentBookingId) return;

    try {
        await fetch(`${API_URL}/${currentBookingId}`, {
            method: "DELETE"
        });

        // Close modal
        const modalElement = document.getElementById("deletebooking");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        loadData(); // Refresh table
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}

// VIEW DETAILS
async function viewDetails(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const b = await res.json();

        document.getElementById("modalContent").innerHTML = `
            <p><strong>Name:</strong> ${b.name || ''}</p>
            <p><strong>Email:</strong> ${b.email || ''}</p>
            <p><strong>Phone:</strong> ${b.phone || ''}</p>
            <p><strong>Date:</strong> ${b.date || ''}</p>
            <p><strong>Slot:</strong> ${b.time || ''}</p>
            <p><strong>Category:</strong> ${b.category || ''}</p>
            <p><strong>Package:</strong> ${b.package || ''}</p>
            <p><strong>Status:</strong> ${b.status || ''}</p>
            <p><strong>Studio:</strong> ${b.studio || ''}</p>
        `;

        new bootstrap.Modal(document.getElementById("detailsModal")).show();
    } catch (err) {
        console.error("Error fetching details:", err);
    }
}

// SEARCH
async function searchData() {
    const q = document.getElementById("searchName").value.toLowerCase();
    const res = await fetch(API_URL);
    const data = await res.json();
    displayTable(data.filter(b => b.name && b.name.toLowerCase().includes(q)));
}

// LOGOUT
function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}

window.onload = loadData;
