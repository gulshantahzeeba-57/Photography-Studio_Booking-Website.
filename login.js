
document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    // Simple Login Logic
    if (user === "admin" && pass === "root") {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Wrong Details! Please try again.");
    }
});
