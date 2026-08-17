
document.addEventListener("DOMContentLoaded", function () {

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const jobsContainer = document.getElementById("jobsContainer");

    if (!jobsContainer) {
        console.error("jobsContainer not found");
        return;
    }

    jobsContainer.innerHTML = "";

    if (jobs.length === 0) {
        jobsContainer.innerHTML = "<p>No jobs posted yet.</p>";
        return;
    }

    jobs.forEach(function (job, index) {

        const jobCard = document.createElement("div");

        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <h2>${job.jobTitle || "Job Title Not Set"}</h2>

            <p>
                <strong>Company:</strong>
                ${job.companyName || "Company Not Set"}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.location || "Not Set"}
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

            <span class="status">Active</span>

            <br><br>

            <button onclick="deleteJob(${index})">
                Delete
            </button>
        `;

        jobsContainer.appendChild(jobCard);
    });
});


function deleteJob(index) {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.splice(index, 1);

    localStorage.setItem("jobs", JSON.stringify(jobs));

    location.reload();
}