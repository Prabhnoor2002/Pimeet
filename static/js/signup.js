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
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');

    passwordInput.addEventListener('input', () => {
        const strength = calculateStrength(passwordInput.value);
        updateStrengthBar(strength);
    });
});

function calculateStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;

    return strength;
}

function updateStrengthBar(strength) {
    const bar = document.getElementById('strength-bar');
    bar.style.width = `${(strength / 5) * 100}%`;

    switch (strength) {
        case 0:
        case 1:
            bar.style.backgroundColor = 'red';
            break;
        case 2:
            bar.style.backgroundColor = 'orange';
            break;
        case 3:
            bar.style.backgroundColor = 'gold';
            break;
        case 4:
            bar.style.backgroundColor = '#a4d600';
            break;
        case 5:
            bar.style.backgroundColor = 'green';
            break;
    }
}

