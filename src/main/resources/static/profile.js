document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("profileForm");

    // Load profile with ID 1
    fetch("/api/profile/1")
        .then(response => {
            if (!response.ok) {
                throw new Error("Profile not found");
            }
            return response.json();
        })
        .then(profile => {

            document.getElementById("name").value =
                profile.name || "";

            document.getElementById("email").value =
                profile.email || "";

            document.getElementById("company").value =
                profile.company || "";

            document.getElementById("phone").value =
                profile.phone || "";

            document.getElementById("qualification").value =
                profile.qualification || "";

            document.getElementById("skills").value =
                profile.skills || "";
        })
        .catch(error => {
            console.log("No existing profile:", error);
        });


    // Save profile
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const profile = {

            name: document.getElementById("name").value,

            email: document.getElementById("email").value,

            company: document.getElementById("company").value,

            phone: document.getElementById("phone").value,

            qualification:
                document.getElementById("qualification").value,

            skills:
                document.getElementById("skills").value
        };

        fetch("/api/profile", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profile)

        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to save profile");
            }

            return response.json();

        })
        .then(data => {

            alert("Profile saved successfully!");

            console.log("Saved profile:", data);

        })
        .catch(error => {

            console.error("Error:", error);

            alert("Profile could not be saved.");
        });

    });

});