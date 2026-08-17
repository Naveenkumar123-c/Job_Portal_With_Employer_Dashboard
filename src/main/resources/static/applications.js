function updateStatus(button, status) {

    let card = button.parentElement;

    let statusText = card.querySelector(".status");

    statusText.textContent = "Status: " + status;
}