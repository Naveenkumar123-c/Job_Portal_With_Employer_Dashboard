document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("jobForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const jobTitle = document.getElementById("jobTitle").value.trim();
        const companyName = document.getElementById("companyName").value.trim();
        const location = document.getElementById("location").value.trim();
        const salary = document.getElementById("salary").value.trim();
        const skills = document.getElementById("skills").value.trim();
        const description = document.getElementById("description").value.trim();

        if (
            jobTitle === "" ||
            companyName === "" ||
            location === "" ||
            salary === "" ||
            skills === "" ||
            description === ""
        ) {
            message.textContent = "Please fill all required fields.";
            message.style.color = "red";
            return;
        }

        const job = {
            jobTitle: jobTitle,
            companyName: companyName,
            location: location,
            salary: salary,
            skills: skills,
            description: description
        };

        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

        jobs.push(job);

        localStorage.setItem("jobs", JSON.stringify(jobs));

        message.textContent = "Job posted successfully!";
        message.style.color = "green";

        form.reset();

    });

});