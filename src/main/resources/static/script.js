document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const message = document.getElementById("message");

    if (email === "" || password === "") {
        message.textContent = "Please enter email and password.";
        return;
    }

    try {

        const formData = new URLSearchParams();

        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const result = await response.text();

        if (!response.ok) {
            message.textContent = "Login failed. Please check your details.";
            return;
        }

        document.open();
        document.write(result);
        document.close();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server. Please try again.";
    }
});