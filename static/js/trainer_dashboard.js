// ========================== Theme & Sidebar ==========================
document.getElementById('themeToggle').addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('closed');
    document.getElementById('content').classList.toggle('shifted');
});

// ========================== Section Handling ==========================
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content > div');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId)?.classList.remove('hidden');
}

// Sidebar submenu toggle
function toggleSubmenu(id) {
    document.getElementById(id)?.classList.toggle("hidden");
}

// ========================== Date Validation ==========================
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

function disablePastDates() {
    const input = document.getElementById('meetingDate');
    if (!input) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    input.min = `${yyyy}-${mm}-${dd}`;
    input.max = `${yyyy + 1}-${mm}-${dd}`;
}

// ========================== Profile Modal ==========================
const profileToggle = document.getElementById("profileToggle");
const profileModal = document.getElementById("profileModal");
const closeModal = document.getElementById("closeModal");
const profileImageInput = document.getElementById("profileImage");
const profileImagePreview = document.getElementById("profileImagePreview");

const trainerData = {
    name: "{{ user.name }}",
    email: "{{ user.email }}",
    role: "{{ user.role }}"
};

profileToggle.addEventListener('click', () => {
    document.getElementById('profileName').value = trainerData.name || '';
    document.getElementById('profileEmail').value = trainerData.email || '';
    document.getElementById('profileRole').value = trainerData.role || '';
    profileImagePreview.src = '';
    profileModal.style.display = 'block';
});

closeModal.addEventListener('click', () => profileModal.style.display = 'none');

profileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) profileImagePreview.src = URL.createObjectURL(file);
    else profileImagePreview.src = '';
});

window.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.style.display = 'none';
});

document.getElementById("profileForm").onsubmit = function (e) {
    e.preventDefault();
    alert("Profile updated successfully!");
    profileModal.style.display = "none";
};

// ========================== Meeting Table Loader ==========================
function loadMeetings() {
    fetch('/meetings')
        .then(response => response.json())
        .then(data => {
            populateTable('previousMeetings', data.previous, 'previous');
            populateTable('currentMeetings', data.current, 'current');
            populateTable('upcomingMeetings', data.upcoming, 'upcoming');
            populateAllMeetings('allMeetings', [...data.previous, ...data.current, ...data.upcoming]);
        })
        .catch(error => console.error('Error loading meetings:', error));
}

function populateTable(sectionId, meetings, type) {
    const section = document.querySelector(`#${sectionId} tbody`);
    section.innerHTML = '';

    if (meetings.length === 0) {
        section.innerHTML = '<tr><td colspan="5" class="text-center">No meetings found.</td></tr>';
        return;
    }

    meetings.forEach((meeting, index) => {
        const row = document.createElement('tr');

        if (type === 'previous') {
            row.innerHTML = `
                <td>${meeting.title}</td>
                <td>${meeting.date}</td>
                <td>${meeting.description}</td>
            `;
        } else if (type === 'current') {
            row.innerHTML = `
                <td>${meeting.title}</td>
                <td>${meeting.description}</td>
                <td>
                    <button class="btn btn-primary btn-sm join-btn" data-id="${meeting.id}">Start</button>
                    <button class="btn btn-danger btn-sm end-btn" data-id="${meeting.id}">End</button>
                </td>
            `;
        } else if (type === 'upcoming') {
            row.innerHTML = `
                <td>${meeting.title}</td>
                <td>${meeting.date}</td>
                <td>${formatTime(meeting.time)}</td>
                <td>${meeting.description}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm cancel-btn" data-id="${meeting.id}">Cancel</button>
                </td>
            `;
        }

        section.appendChild(row);
    });

    if (type === 'upcoming') {
        section.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(meetings[btn.dataset.index]));
        });

        section.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to cancel this meeting.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, cancel it!',
                    cancelButtonText: 'No, keep it'
                }).then(result => {
                    if (result.isConfirmed) {
                        fetch(`/delete_meeting/${btn.dataset.id}`, { method: 'DELETE' })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    Swal.fire('Cancelled!', 'Meeting has been canceled.', 'success');
                                    loadMeetings();
                                } else {
                                    Swal.fire('Failed', 'Could not delete meeting.', 'error');
                                }
                            })
                            .catch(err => Swal.fire('Error', 'Something went wrong!', 'error'));
                    }
                });
            });
        });
    }

    if (type === 'current') {
        section.querySelectorAll('.end-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: 'End this meeting?',
                    text: "This will mark the meeting as ended.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, end it!',
                    cancelButtonText: 'No, keep it'
                }).then(result => {
                    if (result.isConfirmed) {
                        fetch(`/end_meeting/${btn.dataset.id}`, { method: 'POST' })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    Swal.fire('Ended!', 'Meeting has been ended.', 'success');
                                    loadMeetings();
                                } else {
                                    Swal.fire('Failed', 'Could not end the meeting.', 'error');
                                }
                            })
                            .catch(err => Swal.fire('Error', 'Something went wrong!', 'error'));
                    }
                });
            });
        });
    }
}
