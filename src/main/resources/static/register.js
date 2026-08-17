document.getElementById("registerForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;
    const message = document.getElementById("message");

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    if (role === "") {
        message.textContent = "Please select a role.";
        return;
    }

    message.textContent = "Registration successful!";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
});