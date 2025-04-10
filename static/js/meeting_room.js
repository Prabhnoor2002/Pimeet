function toggleTheme() {
    document.body.classList.toggle("light-mode");
}

function startMeeting() {
    document.getElementById("callModal").style.display = "flex";
}

function endCall() {
    document.getElementById("callModal").style.display = "none";
}
