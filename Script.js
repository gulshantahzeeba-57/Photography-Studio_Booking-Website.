// ====== 1. API CONFIGURATION ======
const API_URL = "/bookings";

const header = document.querySelector(".header");
const navbar = document.querySelector(".navbar");

if (header) {
  header.addEventListener("click", () => {
    navbar?.classList.toggle("active");
    header.classList.toggle("active");
  });
}

// ====== 2. MODAL LOGIC ======

// Open a modal by ID
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

// Close a modal by ID
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// Close modals when clicking outside (except booking popup)
window.onclick = function (event) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (modal.id !== "bookingPopup" && event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Prevent booking popup from auto-closing when clicking inside content
document.addEventListener("DOMContentLoaded", () => {
    const popupContent = document.querySelector("#bookingPopup .popup-content");
    if (popupContent) popupContent.addEventListener("click", e => e.stopPropagation());
});


// ====== 3. STUDIO & PACKAGE SELECTION ======

function openStudioDetail(id) { openModal(id); }
function closeStudioDetail(id) { closeModal(id); }

let selectedPackage = "";
let selectedStudio = "";

function bookStudioAndClose(id, studio) {
    selectedStudio = studio;

    const studioField = document.getElementById("studioField");
    if (studioField) {
        studioField.value = "Selected Studio: " + studio;
    }

    closeModal(id);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

function selectPackage(pkg) {
    selectedPackage = pkg;
    const pkgText = document.getElementById("selectedPackageText");
    if (pkgText) pkgText.innerText = "You selected: " + pkg;
    
    const pkgPopup = document.getElementById("packagePopup");
    if (pkgPopup) pkgPopup.style.display = "flex";
}

function selectStudio(studio) {
    const stdText = document.getElementById("selectedStudioText");
    if (stdText) stdText.innerText = "You selected: " + studio;
    
    const stdPopup = document.getElementById("studioPopup");
    if (stdPopup) stdPopup.style.display = "flex";

    selectedStudio = studio;
}

function closePackagePopup() { 
    const pkgPopup = document.getElementById("packagePopup");
    if (pkgPopup) pkgPopup.style.display = "none"; 
}

function goToBooking() {
    closePackagePopup();

    const packageField = document.getElementById("packageField");
    if (packageField) {
        packageField.value = selectedPackage ? "Selected Package: " + selectedPackage : "";
    }

    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

function goToStudios() {
    closePackagePopup();

    const packageField = document.getElementById("packageField");
    if (packageField) {
        packageField.value = selectedPackage ? "Selected Package: " + selectedPackage : "";
    }

    document.getElementById("Studios")?.scrollIntoView({ behavior: "smooth" });
}


// ====== 4. BOOKING FORM LOGIC ======
const bookingForm = document.getElementById("bookingForm");
const bookingPopup = document.getElementById("bookingPopup");
const bookingMsgEl = document.getElementById("bookingMsg"); 

bookingForm?.addEventListener("submit", async e => {
    e.preventDefault();
    
    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const date = document.getElementById("date")?.value || "";
    const time = document.getElementById("time")?.value || "";
    const category = document.getElementById("category")?.value || "";

    // Validation
    if (!selectedPackage || !selectedStudio) { 
        alert("Please select a Package and Studio first."); 
        return; 
    }

    const newBooking = {
        _id: Date.now().toString(),
        name, 
        email, 
        phone, 
        date, 
        time, 
        category, 
        package: selectedPackage, 
        studio: selectedStudio, 
        status: "Pending" 
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBooking)
        });

        let savedData = newBooking;
        if (response.ok) {
            try {
                const resJson = await response.json();
                if (resJson && resJson._id) savedData = resJson;
            } catch(err) {}
        }

        // ✅ LocalStorage mein save karein taake Admin Dashboard par 100% show ho
        let localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
        localData.push(savedData);
        localStorage.setItem('studio_bookings', JSON.stringify(localData));

        // Success popup
        if (bookingPopup) bookingPopup.style.display = "flex";
        if (bookingMsgEl) {
            bookingMsgEl.innerText = `Booking submitted for ${selectedStudio}.`;
            bookingMsgEl.style.color = "#2d4202";
        }

        // Form Reset
        resetFormState();

    } catch (err) {
        console.warn("API Push Error, saving to local backup:", err);

        // Server offline honay par bhi local backup mein save ho jaye ga
        let localData = JSON.parse(localStorage.getItem('studio_bookings') || '[]');
        localData.push(newBooking);
        localStorage.setItem('studio_bookings', JSON.stringify(localData));

        if (bookingPopup) bookingPopup.style.display = "flex";
        if (bookingMsgEl) {
            bookingMsgEl.innerText = `Booking submitted for ${selectedStudio}.`;
            bookingMsgEl.style.color = "#2d4202";
        }

        resetFormState();
    }
});


// ====== 5. HELPER FUNCTIONS ======
function resetFormState() {
    if (bookingForm) bookingForm.reset();
    selectedPackage = "";
    selectedStudio = "";
    
    const pkgText = document.getElementById("selectedPackageText");
    const stdText = document.getElementById("selectedStudioText");
    if (pkgText) pkgText.innerText = "";
    if (stdText) stdText.innerText = "";
}

function closePopup() {
    if (bookingPopup) {
        bookingPopup.style.display = "none";
    }
    resetFormState();
}
