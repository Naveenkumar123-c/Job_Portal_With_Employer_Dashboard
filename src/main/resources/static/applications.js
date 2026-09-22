document.addEventListener("DOMContentLoaded", function () {
    loadApplications();
});

function loadApplications() {

    const container =
        document.getElementById("applicationsContainer");

    fetch("/api/applications")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load applications");
            }

            return response.json();
        })

        .then(applications => {

            container.innerHTML = "";

            if (applications.length === 0) {
                container.innerHTML =
                    "<p>No applications found.</p>";
                return;
            }

            applications.forEach(application => {

                const card =
                    document.createElement("div");

                card.className = "application-card";

                card.innerHTML = `
                    <h2>${escapeHtml(application.applicantName)}</h2>

                    <p>
                        <b>Email:</b>
                        ${escapeHtml(application.email)}
                    </p>

                    <p>
                        <b>Job:</b>
                        ${escapeHtml(application.jobTitle)}
                    </p>

                    <p>
                        <b>Experience:</b>
                        ${escapeHtml(application.experience)}
                    </p>

                    <p class="status" id="status-${application.id}">
                        <b>Status:</b>
                        ${escapeHtml(application.status || "Pending")}
                    </p>

                    <button
                        class="select-btn"
                        onclick="updateStatus(${application.id}, 'Selected')">
                        Select
                    </button>

                    <button
                        class="reject-btn"
                        onclick="updateStatus(${application.id}, 'Rejected')">
                        Reject
                    </button>

                    <button
                        class="resume-btn"
                        onclick="viewResume(${application.id})">
                        View Resume
                    </button>
                `;

                container.appendChild(card);
            });
        })

        .catch(error => {

            console.error("Error:", error);

            container.innerHTML =
                "<p>Unable to load applications from server.</p>";
        });
}


function updateStatus(id, status) {

    fetch(`/api/applications/${id}/status?status=${encodeURIComponent(status)}`, {

        method: "PUT"
    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update status");
        }

        return response.json();
    })

    .then(application => {

        const statusElement =
            document.getElementById(`status-${id}`);

        if (statusElement) {

            statusElement.innerHTML =
                `<b>Status:</b> ${escapeHtml(application.status)}`;
        }

        alert("Application status updated successfully.");
    })

    .catch(error => {

        console.error("Error:", error);

        alert("Status could not be updated.");
    });
}


function viewResume(id) {

    const resumeUrl =
        `/api/applications/${id}/resume`;

    window.open(resumeUrl, "_blank");
}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}