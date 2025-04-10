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

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const secretKeyGroup = document.getElementById('secret-key-group');

    usernameInput.addEventListener('blur', async () => {
        const username = usernameInput.value;
        if (username) {
            // Fetch the role from the server
            const response = await fetch(`/get_role?username=${username}`);
            const data = await response.json();

            // Show or hide the secret key field based on the role
            if (data.role === 'admin' || data.role === 'trainer') {
                secretKeyGroup.style.display = 'block';
            } else {
                secretKeyGroup.style.display = 'none';
            }
        }
    });
});
