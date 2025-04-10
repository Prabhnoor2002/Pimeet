// ========================== Theme & Sidebar ==========================
document.getElementById('themeToggle').addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

setTimeout(() => {
    document.querySelectorAll('.toast-message').forEach(msg => {
      msg.remove();
    });
  }, 4000);
  
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

// Open profile modal
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



// ========================== Meeting Table Loader ==========================
function loadMeetings() {
    fetch('/meetings')
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const updatedCurrent = [];
            const updatedPrevious = [];
            const updatedUpcoming = [];

            data.current.forEach(meeting => {
                const startTime = new Date(`${meeting.date}T${meeting.time}`);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // assuming 1-hour meeting

                if (endTime < now) {
                    // Meeting has already ended
                    updatedPrevious.push(meeting);
                } else if (startTime > now) {
                    // Meeting has not started yet
                    updatedUpcoming.push(meeting);
                } else {
                    // Meeting is ongoing
                    updatedCurrent.push(meeting);
                }
            });

            // Merge these with other categorized meetings if needed
            const allPrevious = [...data.previous, ...updatedPrevious];
            const allUpcoming = [...data.upcoming, ...updatedUpcoming];

            populateTable('previousMeetings', allPrevious, 'previous');
            populateTable('currentMeetings', updatedCurrent, 'current');
            populateTable('upcomingMeetings', allUpcoming, 'upcoming');
            populateAllMeetings('allMeetings', [...allPrevious, ...updatedCurrent, ...allUpcoming]);
        })
        .catch(error => console.error('Error loading meetings:', error));
}
// Open modal and set meeting ID
function openRescheduleModal(meetingId) {
    const modal = document.getElementById("rescheduleModal");
    const meetingIdInput = document.getElementById("modalMeetingId");

    if (modal && meetingIdInput) {
      meetingIdInput.value = meetingId;
      modal.style.display = "block";
    }
    disablePastDates();
  }

  // Close modal on clicking the close button
  document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("modalCloseBtn");
    const modal = document.getElementById("rescheduleModal");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
      });
    }

    // Optional: Close modal on outside click
    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById("newDate");
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute("min", today);
  });
  document.getElementById("editMeetingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("editMeetingId").value;
    const title = document.getElementById("editTitle").value;
    const date = document.getElementById("editDate").value;
    const time = document.getElementById("editTime").value;
    const description = document.getElementById("editDescription").value;

    // Optional: Add client-side validation here if needed

    fetch(`/edit_meeting/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, time, description })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Updated!', 'Meeting has been updated.', 'success');
            closeEditModal();
            loadMeetings();
        } else {
            Swal.fire('Failed', 'Could not update meeting.', 'error');
        }
    })
    .catch(err => Swal.fire('Error', 'Something went wrong!', 'error'));
});
function openEditModal(meeting) {
    document.getElementById("editMeetingId").value = meeting.id;
    document.getElementById("editTitle").value = meeting.title;
    document.getElementById("editDate").value = meeting.date;
    document.getElementById("editTime").value = meeting.time;
    document.getElementById("editDescription").value = meeting.description;
    document.getElementById("editMeetingModal").style.display = "block";
}
function closeEditModal() {
    document.getElementById("editMeetingModal").style.display = "none";
}
