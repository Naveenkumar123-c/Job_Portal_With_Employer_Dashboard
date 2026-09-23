document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("profileForm");
    const message = document.getElementById("message");

    let profileId = null;


    // =========================
    // Helper: Show Message
    // =========================

    function showMessage(text, type) {

        message.textContent = text;

        message.className = "profile-message " + type;

    }


    // =========================
    // Load Existing Profile
    // =========================

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

            console.log(
                "No existing profile:",
                error
            );

        });


    // =========================
    // Save / Update Profile
    // =========================

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const profile = {

            name:
                document.getElementById("name").value.trim(),

            email:
                document.getElementById("email").value.trim(),

            company:
                document.getElementById("company").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            qualification:
                document.getElementById("qualification").value.trim(),

            skills:
                document.getElementById("skills").value.trim()

        };


        // =========================
        // Determine API
        // =========================

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


        // Disable button while saving

        const saveButton =
            form.querySelector(".save-profile-btn");

        saveButton.disabled = true;

        saveButton.textContent = "Saving...";


        showMessage(
            "Saving profile...",
            "saving"
        );


        // =========================
        // Send Request
        // =========================

        fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(profile)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to save profile"
                );

            }

            return response.json();

        })

        .then(data => {

            profileId = data.id;


            showMessage(
                "Profile saved successfully!",
                "success"
            );


            console.log(
                "Saved profile:",
                data
            );

        })

        .catch(error => {

            console.error(
                "Error:",
                error
            );


            showMessage(
                "Profile could not be saved. Please try again.",
                "error"
            );

        })

        .finally(() => {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Profile";

        });

    });

});