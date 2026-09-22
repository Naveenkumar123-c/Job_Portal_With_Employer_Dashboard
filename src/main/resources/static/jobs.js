let allJobs = [];


document.addEventListener("DOMContentLoaded", function () {

    loadJobs();

});


function loadJobs() {

    fetch("/api/jobs")
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();

        })
        .then(jobs => {

            allJobs = jobs;

            displayJobs(allJobs);

        })
        .catch(error => {

            console.error(error);

            document.getElementById("jobsContainer").innerHTML =
                "<p>Unable to load jobs.</p>";
        });

}


function displayJobs(jobs) {

    const container =
        document.getElementById("jobsContainer");

    if (!jobs || jobs.length === 0) {

        container.innerHTML =
            "<p>No jobs available.</p>";

        return;
    }


    container.innerHTML = "";


    jobs.forEach(job => {

        const card =
            document.createElement("div");

        card.className = "job-card";


        card.innerHTML = `

            <h2>
                ${job.title || "Job Title"}
            </h2>

            <p>
                <strong>Company:</strong>
                ${job.company || "Not specified"}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.location || "Not specified"}
            </p>

            <p>
                <strong>Job Type:</strong>
                ${job.type || "Not specified"}
            </p>

            <p>
                <strong>Skills:</strong>
                ${job.skills || "Not specified"}
            </p>

            <p>
                <strong>Description:</strong>
                ${job.description || "No description available"}
            </p>

            <button
                onclick="applyForJob(${job.id})">

                Apply Now

            </button>

        `;


        container.appendChild(card);

    });

}


function searchJobs() {

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    if (searchText === "") {

        displayJobs(allJobs);

        return;
    }


    const filteredJobs =
        allJobs.filter(job => {

            const title =
                (job.title || "")
                    .toLowerCase();

            const company =
                (job.company || "")
                    .toLowerCase();

            const skills =
                (job.skills || "")
                    .toLowerCase();

            const location =
                (job.location || "")
                    .toLowerCase();


            return (
                title.includes(searchText) ||
                company.includes(searchText) ||
                skills.includes(searchText) ||
                location.includes(searchText)
            );

        });


    displayJobs(filteredJobs);

}


function applyForJob(jobId) {

    window.location.href =
        "/apply.html?jobId=" + jobId;

}