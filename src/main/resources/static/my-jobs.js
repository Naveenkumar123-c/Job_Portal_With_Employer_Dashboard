document.addEventListener("DOMContentLoaded", function () {

    const jobsContainer = document.getElementById("jobsContainer");

    if (!jobsContainer) {
        console.error("jobsContainer not found");
        return;
    }

    loadJobs();
});


// ==========================================
// LOAD ALL JOBS
// ==========================================

function loadJobs() {

    const jobsContainer = document.getElementById("jobsContainer");

    fetch("/api/jobs")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();
        })

        .then(jobs => {

            jobsContainer.innerHTML = "";

            if (jobs.length === 0) {

                jobsContainer.innerHTML = `
                    <div class="no-jobs">
                        <p>No jobs posted yet.</p>
                    </div>
                `;

                return;
            }


            jobs.forEach(function (job) {

                const jobCard = document.createElement("div");

                jobCard.className = "job-card";


                jobCard.innerHTML = `

                    <h2>
                        ${job.title || "Job Title Not Set"}
                    </h2>

                    <p>
                        <strong>Company:</strong>
                        ${job.company || "Company Not Set"}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${job.location || "Not Set"}
                    </p>

                    <p>
                        <strong>Job Type:</strong>
                        ${job.type || "Not Set"}
                    </p>

                    <p>
                        <strong>Salary:</strong>
                        ${job.salary || "Not Set"}
                    </p>

                    <p>
                        <strong>Skills:</strong>
                        ${job.skills || "Not Set"}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${job.description || "No description"}
                    </p>


                    <div class="actions">

                        <button
                            class="edit-btn"
                            onclick="editJob(${job.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteJob(${job.id})">
                            Delete
                        </button>

                    </div>
                `;


                jobsContainer.appendChild(jobCard);

            });

        })

        .catch(error => {

            console.error("Error loading jobs:", error);

            jobsContainer.innerHTML = `
                <div class="no-jobs">
                    <p>Unable to load jobs from server.</p>
                </div>
            `;

        });
}



// ==========================================
// EDIT JOB
// ==========================================

function editJob(id) {

    fetch(`/api/jobs/${id}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Job not found");
            }

            return response.json();

        })

        .then(job => {

            const title =
                prompt("Job Title:", job.title);

            if (title === null) {
                return;
            }


            const company =
                prompt("Company:", job.company);

            if (company === null) {
                return;
            }


            const location =
                prompt("Location:", job.location);

            if (location === null) {
                return;
            }


            const type =
                prompt("Job Type:", job.type);

            if (type === null) {
                return;
            }


            const salary =
                prompt("Salary:", job.salary);

            if (salary === null) {
                return;
            }


            const skills =
                prompt("Skills:", job.skills || "");

            if (skills === null) {
                return;
            }


            const description =
                prompt(
                    "Description:",
                    job.description || ""
                );

            if (description === null) {
                return;
            }


            const updatedJob = {

                title: title.trim(),

                company: company.trim(),

                location: location.trim(),

                type: type.trim(),

                salary: salary.trim(),

                skills: skills.trim(),

                description: description.trim()

            };


            return fetch(`/api/jobs/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedJob)

            });

        })


        .then(response => {

            if (!response) {
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update job");
            }

            return response.json();

        })


        .then(data => {

            if (!data) {
                return;
            }

            alert("Job updated successfully!");

            loadJobs();

        })


        .catch(error => {

            console.error(
                "Edit error:",
                error
            );

            alert(
                "Job could not be updated."
            );

        });

}



// ==========================================
// DELETE JOB
// ==========================================

function deleteJob(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmed) {
        return;
    }


    fetch(`/api/jobs/${id}`, {

        method: "DELETE"

    })


    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Failed to delete job"
            );
        }

        return response.text();

    })


    .then(message => {

        alert(message);

        loadJobs();

    })


    .catch(error => {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Job could not be deleted."
        );

    });

}