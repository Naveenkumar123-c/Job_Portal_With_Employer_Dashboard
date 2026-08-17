document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (email === "" || password === "") {
        document.getElementById("message").textContent =
            "Please enter email and password.";
        return;
    }

    if (role === "employer") {
        window.location.href = "employer-dashboard.html";
    } else {
        document.getElementById("message").textContent =
            "Candidate dashboard coming soon!";
    }
});