// ====== 1. API CONFIGURATION ======
// const API_URL = "http://localhost:3000/bookings";
const API_URL = "/bookings";

const header = document.querySelector(".header");
const navbar = document.querySelector(".navbar");

header.addEventListener("click", () => {
  navbar.classList.toggle("active");
  header.classList.toggle("active");
});

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

// Studio detail open/close helpers
function openStudioDetail(id) { openModal(id); }
function closeStudioDetail(id) { closeModal(id); }

// Select a studio and scroll to booking section (from studio popup)
function bookStudioAndClose(id, studio) {
    // Set selected studio globally
    selectedStudio = studio;

    // Update booking form field
    const studioField = document.getElementById("studioField");
    if (studioField) {
        studioField.value = "Selected Studio: " + studio;
    }

    // Close studio popup
    closeModal(id);

    // Scroll to booking section
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

// Package & Studio selection
let selectedPackage = "";
let selectedStudio = "";

function selectPackage(pkg) {
    selectedPackage = pkg;
    document.getElementById("selectedPackageText").innerText = "You selected: " + pkg;
    document.getElementById("packagePopup").style.display = "flex";
}

// Studio selection from studio list (opens popup)
function selectStudio(studio) {
    // Just show popup with selected studio name
    document.getElementById("selectedStudioText").innerText = "You selected: " + studio;
    document.getElementById("studioPopup").style.display = "flex";

    // Set temporary selection, actual form update happens on bookStudioAndClose()
    selectedStudio = studio;
}

// Close package popup
function closePackagePopup() { 
    document.getElementById("packagePopup").style.display = "none"; 
}

// Navigate to booking or studios from package popup
function goToBooking() {
    closePackagePopup();

    // Update package field in booking form
    const packageField = document.getElementById("packageField");
    if (packageField) {
        packageField.value = selectedPackage ? "Selected Package: " + selectedPackage : "";
    }

    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
}

function goToStudios() {
    closePackagePopup();

    // Update package field in booking form
    const packageField = document.getElementById("packageField");
    if (packageField) {
        packageField.value = selectedPackage ? "Selected Package: " + selectedPackage : "";
    }

    document.getElementById("Studios")?.scrollIntoView({ behavior: "smooth" });
}
// });
// ====== 4. BOOKING FORM LOGIC ======
const bookingForm = document.getElementById("bookingForm");
const bookingPopup = document.getElementById("bookingPopup");
const bookingMsgEl = document.getElementById("bookingMsg"); 

bookingForm?.addEventListener("submit", async e => {
    e.preventDefault();
    
    // Values capture karein
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const category = document.getElementById("category").value;
    
    // Yahan .value use karna hai
    const studioName = document.getElementById("studioField").value; 
    const packageName = document.getElementById("packageField").value;

    // Validation
    if (!selectedPackage || !selectedStudio) { 
        alert("Please select a Package and Studio first."); 
        return; 
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name, 
                email,      // Ab yeh save hoga
                phone,      // Ab yeh save hoga
                date, 
                time, 
                category,   // Ab yeh save hoga
                package: selectedPackage, 
                studio: selectedStudio, 
                status: "Pending" 
            })
        });

        if (response.ok) {
            // Success par popup dikhayein
            if (bookingPopup) bookingPopup.style.display = "flex";
            if (bookingMsgEl) {
                bookingMsgEl.innerText = `Booking submitted for ${selectedStudio}.`;
                bookingMsgEl.style.color = "#2d4202";
            }

            // Form reset karein
            bookingForm.reset();
            selectedPackage = "";
            selectedStudio = "";
            document.getElementById("selectedPackageText").innerText = "";
            document.getElementById("selectedStudioText").innerText = "";
        }
    } catch (err) {
        console.error("Booking save failed:", err);
        alert("Error: Server could not connected!");
    }
});

// ====== 5. BOOKING POPUP CLOSE ======
function closePopup() {
    if (bookingPopup) {
        bookingPopup.style.display = "none";
    }
}


// ====== 5. BOOKING POPUP CLOSE ======
function closePopup() {
    bookingPopup.style.display = "none";
    bookingForm.reset();
    selectedPackage = "";
    selectedStudio = "";
    document.getElementById("selectedPackageText").innerText = "";
    document.getElementById("selectedStudioText").innerText = "";
}
