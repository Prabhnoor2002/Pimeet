// Toggle theme
document.getElementById('themeToggle').addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

// Sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('closed');
    document.getElementById('content').classList.toggle('shifted');
});

// Show section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content > div');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Submenu toggle
function toggleSubmenu(submenuId) {
    document.getElementById(submenuId).classList.toggle('hidden');
}

// Validate meeting form
function validateMeetingForm() {
    const meetingDate = document.getElementById('meetingDate').value;
    const meetingTime = document.getElementById('meetingTime').value;
    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${meetingDate}T${meetingTime}`);

    if (selectedDateTime < currentDateTime) {
        alert('Meeting cannot be scheduled in the past.');
        return false;
    }
    return true;
}

// Disable past dates
function disablePastDates() {
    const input = document.getElementById('meetingDate');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    input.min = `${yyyy}-${mm}-${dd}`;
}


    const profileToggle = document.getElementById("profileToggle");
    const profileModal = document.getElementById("profileModal");
    const closeModal = document.getElementById("closeModal");
    const profileImageInput = document.getElementById("profileImage");
    const profileImagePreview = document.getElementById("profileImagePreview");

    profileToggle.onclick = () => {
        profileModal.style.display = "block";
    };

    closeModal.onclick = () => {
        profileModal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = "none";
        }
    };

    profileImageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileImagePreview.src = URL.createObjectURL(file);
        }
    };

    // You can pre-fill form fields here from user data if available
    document.getElementById("profileForm").onsubmit = function(e) {
        e.preventDefault();
        alert("Profile updated successfully!");
        profileModal.style.display = "none";
    };
// Simulated trainer data (replace these values using templating engine if needed)
const trainerData = {
    name: "{{ user.name }}",    // or hardcode for now: "John Doe"
    email: "{{ user.email }}",  // or: "john@example.com"
    role: "{{ user.role }}"     // or: "Trainer"
};

// Show profile modal & auto-fill values
document.getElementById('profileToggle').addEventListener('click', function () {
    document.getElementById('profileName').value = trainerData.name || '';
    document.getElementById('profileEmail').value = trainerData.email || '';
    document.getElementById('profileRole').value = trainerData.role || '';

    // Clear previous image preview (optional)
    document.getElementById('profileImagePreview').src = '';

    // Show modal
    document.getElementById('profileModal').style.display = 'block';
});

// Close modal on X click
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('profileModal').style.display = 'none';
});

// Optional: Close modal if clicked outside
window.onclick = function (event) {
    const modal = document.getElementById('profileModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Show image preview when selected
document.getElementById('profileImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profileImagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
    }
});
