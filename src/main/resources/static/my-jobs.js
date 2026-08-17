document.addEventListener("DOMContentLoaded", function () {

    const jobsContainer =
        document.getElementById("jobsContainer");

    if (!jobsContainer) {
        return;
    }

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    if (jobs.length === 0) {

        jobsContainer.innerHTML =
            "<p>No jobs posted yet.</p>";

        return;
    }

    jobsContainer.innerHTML = "";

    jobs.forEach(function (job) {

        const jobCard = document.createElement("div");

        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <h2>${job.title}</h2>

            <p><strong>Company:</strong>
                ${job.company}
            </p>

            <p><strong>Location:</strong>
                ${job.location}
            </p>

            <p><strong>Salary:</strong>
                ${job.salary || "Not specified"}
            </p>

            <p><strong>Description:</strong>
                ${job.description || "No description"}
            </p>

            <button onclick="deleteJob(${job.id})">
                Delete
            </button>
        `;

        jobsContainer.appendChild(jobCard);
    });
});


function deleteJob(id) {

    let jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    jobs = jobs.filter(function (job) {
        return job.id !== id;
    });

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

    location.reload();
}