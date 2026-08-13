const API_URL = "/bookings";

document.getElementById('todayDate').innerText =
    "System Date: " + new Date().toDateString();

// LOAD DATA
async function loadData() {
    let data = [];
    try {
        const res = await fetch(API_URL);
        if (res.ok) {
            data = await res.json();
        }
    } catch (err) {
        console.warn("API fetch failed, reading local storage backup");
    }

    const localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
    const combinedData = [...data, ...localData];

    const uniqueBookings = Array.from(
        new Map(combinedData.map(item => [item['_id'], item])).values()
    );

    displayTable(uniqueBookings);
}

// DISPLAY TABLE
function displayTable(data) {
    const tbody = document.getElementById("bookingsTableBody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3">No bookings found.</td></tr>`;
        return;
    }

    data.forEach(b => {
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

// UPDATE STATUS
async function updateStatus(id, status) {
    let localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
    localData = localData.map(item => item._id === id ? { ...item, status } : item);
    localStorage.setItem('studio_bookings', JSON.stringify(localData));

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status }) 
        });
    } catch (e) {
        console.warn("Server update skipped");
    }

    loadData();
}

let currentBookingId = null;

function deleteBooking(id) {
    currentBookingId = id;
    const modal = new bootstrap.Modal(document.getElementById("deletebooking"));
    modal.show();
}

// REJECT / DELETE
async function reject() {
    if (!currentBookingId) return;

    let localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
    localData = localData.filter(item => item._id !== currentBookingId);
    localStorage.setItem('studio_bookings', JSON.stringify(localData));

    try {
        await fetch(`${API_URL}/${currentBookingId}`, { method: "DELETE" });
    } catch (e) {
        console.warn("Server delete skipped");
    }

    const modalElement = document.getElementById("deletebooking");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();

    loadData();
}

// VIEW DETAILS
function viewDetails(id) {
    const localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
    const b = localData.find(item => item._id === id) || {};

    document.getElementById("modalContent").innerHTML = `
        <p><strong>Name:</strong> ${b.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${b.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${b.phone || 'N/A'}</p>
        <p><strong>Date:</strong> ${b.date || 'N/A'}</p>
        <p><strong>Slot:</strong> ${b.time || 'N/A'}</p>
        <p><strong>Category:</strong> ${b.category || 'N/A'}</p>
        <p><strong>Package:</strong> ${b.package || 'N/A'}</p>
        <p><strong>Status:</strong> ${b.status || 'Pending'}</p>
        <p><strong>Studio:</strong> ${b.studio || 'N/A'}</p>
    `;

    new bootstrap.Modal(document.getElementById("detailsModal")).show();
}

// SEARCH
function searchData() {
    const q = document.getElementById("searchName").value.toLowerCase();
    const localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
    displayTable(localData.filter(b => b.name && b.name.toLowerCase().includes(q)));
}

// LOGOUT
function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}

window.onload = loadData;
