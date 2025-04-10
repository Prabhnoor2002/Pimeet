// Automatically hide flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', () => {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000); // 5 seconds
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i'); // Select the <i> element inside the button

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change to sun icon for light mode
    }

    // Add click event listener to toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change to sun icon for light mode
            localStorage.setItem('theme', 'light'); // Save theme preference
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon'); // Change to moon icon for dark mode
            localStorage.setItem('theme', 'dark'); // Save theme preference
        }
    });
});

function toggleSecretKeyField() {
    const role = document.getElementById('role').value;
    const secretKeyGroup = document.getElementById('secret-key-group');
    if (role === 'admin' || role === 'trainer') {
        secretKeyGroup.style.display = 'block';
    } else {
        secretKeyGroup.style.display = 'none';
    }
}
function checkPasswordStrength() {
    const password = document.getElementById("password").value;
    const hint = document.getElementById("password-hint");
    const bar = document.getElementById("strength-bar");

    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&#^()\-_=+{};:,<.>]/.test(password)) strength += 1;

    // Update the bar
    bar.style.width = `${(strength / 5) * 100}%`;

    if (strength <= 2) {
        bar.style.backgroundColor = "red";
        hint.textContent = "Weak password ❌";
        hint.style.color = "red";
    } else if (strength === 3 || strength === 4) {
        bar.style.backgroundColor = "orange";
        hint.textContent = "Moderate password ⚠️";
        hint.style.color = "orange";
    } else if (strength === 5) {
        bar.style.backgroundColor = "green";
        hint.textContent = "Strong password ✅";
        hint.style.color = "green";
    }
}

