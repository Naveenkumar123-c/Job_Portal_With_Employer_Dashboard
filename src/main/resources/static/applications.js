document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadApplications();

    }
);


/* =========================
   Load Applications
   ========================= */

function loadApplications() {

    const container =
        document.getElementById(
            "applicationsContainer"
        );


    container.innerHTML = `
        <div class="loading-message">
            Loading applications...
        </div>
    `;


    fetch("/api/applications")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load applications"
                );

            }

            return response.json();

        })

        .then(applications => {

            displayApplications(
                applications
            );

        })

        .catch(error => {

            console.error(
                "Error:",
                error
            );


            container.innerHTML = `
                <div class="loading-message error-state">

                    <h2>
                        Unable to load applications
                    </h2>

                    <p>
                        Please try again later.
                    </p>

                </div>
            `;

        });

}


/* =========================
   Display Applications
   ========================= */

function displayApplications(
    applications
) {

    const container =
        document.getElementById(
            "applicationsContainer"
        );


    container.innerHTML = "";


    /* No applications */

    if (
        !applications ||
        applications.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h2>
                    No Applications Found
                </h2>

                <p>
                    There are currently no job
                    applications to review.
                </p>

            </div>

        `;

        return;

    }


    /* Display applications */

    applications.forEach(
        application => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "application-card";


            const status =
                application.status ||
                "Pending";


            card.innerHTML = `

                <!-- Header -->

                <div class="application-header">

                    <div>

                        <h2>
                            ${escapeHtml(
                                application.applicantName
                            )}
                        </h2>

                        <p class="application-job">

                            Applied for:
                            ${escapeHtml(
                                application.jobTitle
                            )}

                        </p>

                    </div>


                    <span
                        class="status-badge">

                        ${escapeHtml(status)}

                    </span>

                </div>


                <!-- Candidate Details -->

                <div class="application-details">


                    <div class="application-detail">

                        <span class="detail-label">
                            Email
                        </span>

                        <span class="detail-value">

                            ${escapeHtml(
                                application.email
                            )}

                        </span>

                    </div>


                    <div class="application-detail">

                        <span class="detail-label">
                            Experience
                        </span>

                        <span class="detail-value">

                            ${escapeHtml(
                                application.experience
                            )}

                        </span>

                    </div>


                    <div class="application-detail">

                        <span class="detail-label">
                            Job
                        </span>

                        <span class="detail-value">

                            ${escapeHtml(
                                application.jobTitle
                            )}

                        </span>

                    </div>


                    <div class="application-detail">

                        <span class="detail-label">
                            Application Status
                        </span>

                        <span
                            class="detail-value"
                            id="status-${application.id}">

                            ${escapeHtml(status)}

                        </span>

                    </div>


                </div>


                <!-- Actions -->

                <div class="application-actions">


                    <button
                        class="select-btn"
                        onclick="updateStatus(
                            ${application.id},
                            'Selected'
                        )">

                        Select

                    </button>


                    <button
                        class="reject-btn"
                        onclick="updateStatus(
                            ${application.id},
                            'Rejected'
                        )">

                        Reject

                    </button>


                    <button
                        class="resume-btn"
                        onclick="viewResume(
                            ${application.id}
                        )">

                        View Resume

                    </button>


                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =========================
   Update Status
   ========================= */

function updateStatus(
    id,
    status
) {

    fetch(
        `/api/applications/${id}/status?status=${encodeURIComponent(status)}`,
        {
            method: "PUT"
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to update status"
            );

        }

        return response.json();

    })

    .then(application => {

        const statusElement =
            document.getElementById(
                `status-${id}`
            );


        if (statusElement) {

            statusElement.textContent =
                application.status;

        }


        /*
         * Also update the badge.
         */

        const card =
            statusElement
                ?.closest(
                    ".application-card"
                );


        if (card) {

            const badge =
                card.querySelector(
                    ".status-badge"
                );


            if (badge) {

                badge.textContent =
                    application.status;

            }

        }


        alert(
            "Application status updated successfully."
        );

    })

    .catch(error => {

        console.error(
            "Error:",
            error
        );


        alert(
            "Status could not be updated."
        );

    });

}


/* =========================
   View Resume
   ========================= */

function viewResume(id) {

    const resumeUrl =
        `/api/applications/${id}/resume`;


    window.open(
        resumeUrl,
        "_blank"
    );

}


/* =========================
   Escape HTML
   ========================= */

function escapeHtml(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}