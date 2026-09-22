document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("profileForm");

    let profileId = null;

    // Load existing profile
    fetch("/api/profile/me")
        .then(response => {
            if (!response.ok) {
                throw new Error("Profile not found");
            }

            return response.json();
        })
        .then(profile => {

            profileId = profile.id;

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


    // Save / Update profile
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const profile = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            company: document.getElementById("company").value,
            phone: document.getElementById("phone").value,
            qualification: document.getElementById("qualification").value,
            skills: document.getElementById("skills").value
        };

        let url;
        let method;

        if (profileId) {

            // Update existing profile
            url = "/api/profile/me";
            method = "PUT";

        } else {

            // Create new profile
            url = "/api/profile";
            method = "POST";
        }

        fetch(url, {
            method: method,
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

            profileId = data.id;

            alert("Profile saved successfully!");

            console.log("Saved profile:", data);
        })
        .catch(error => {

            console.error("Error:", error);

            alert("Profile could not be saved.");
        });

    });

});