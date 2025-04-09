// Function to show specific sections
function showSection(section) {
    document.getElementById('meetings').classList.add('hidden');
    document.getElementById('trainers').classList.add('hidden');
    document.getElementById(section).classList.remove('hidden');
}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
    content.classList.toggle('shifted');
});

// Function to toggle sub-menu visibility
function toggleSubMenu(subMenuId) {
    const subMenu = document.getElementById(subMenuId);
    subMenu.classList.toggle('hidden');
}

// Function to show specific sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content > div');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

document.getElementById("profileToggle").onclick = function () {
    document.getElementById("profileModal").style.display = "block";
};

// Close profile modal
document.getElementById("closeModal").onclick = function () {
    document.getElementById("profileModal").style.display = "none";
};

// Close modal if click outside content
window.onclick = function (event) {
    const modal = document.getElementById("profileModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

