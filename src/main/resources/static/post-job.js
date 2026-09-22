document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("jobForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const job = {
            title: document.getElementById("jobTitle").value.trim(),
            company: document.getElementById("companyName").value.trim(),
            location: document.getElementById("location").value.trim(),
            type: document.getElementById("type").value.trim(),
            salary: document.getElementById("salary").value.trim(),
            skills: document.getElementById("skills").value.trim(),
            description: document.getElementById("description").value.trim()
        };

        if (
            job.title === "" ||
            job.company === "" ||
            job.location === "" ||
            job.type === "" ||
            job.salary === "" ||
            job.skills === "" ||
            job.description === ""
        ) {
            message.textContent = "Please fill all required fields.";
            message.style.color = "red";
            return;
        }

        fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(job)
        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to save job");
            }

            return response.json();
        })
        .then(data => {

            console.log("Saved job:", data);

            message.textContent = "Job posted successfully!";
            message.style.color = "green";

            form.reset();
        })
        .catch(error => {

            console.error("Error:", error);

            message.textContent =
                "Job could not be saved. Check the backend.";

            message.style.color = "red";
        });

    });

});
