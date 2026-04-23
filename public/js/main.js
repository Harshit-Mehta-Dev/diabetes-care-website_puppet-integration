// Unified Navigation and Initialization for Diabetes Care Platform
document.addEventListener('DOMContentLoaded', function() {
    // Page navigation logic
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetPageId = href.substring(1);
                
                // Update navigation active state
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                
                // Switch pages
                pages.forEach(page => {
                    if (page.id === targetPageId) {
                        page.classList.add('active');
                    } else {
                        page.classList.remove('active');
                    }
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, href);
                window.scrollTo(0, 0);
            }
        });
    });

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Load theme preference
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Initialize Modular Features
    // We use try-catch to prevent one failing module from breaking others
    try {
        if (typeof initChatbot === 'function') initChatbot();
    } catch (e) { console.error("Chatbot init failed:", e); }

    try {
        if (typeof initProfile === 'function') initProfile();
    } catch (e) { console.error("Profile init failed:", e); }

    try {
        if (typeof initTracker === 'function') initTracker();
    } catch (e) { console.error("Tracker init failed:", e); }

    try {
        if (typeof initAsk === 'function') initAsk();
    } catch (e) { console.error("Ask Doctor init failed:", e); }

    // Handle deep linking on initial load
    const initialHash = window.location.hash;
    if (initialHash) {
        const targetLink = document.querySelector(`.sidebar nav ul li a[href="${initialHash}"]`);
        if (targetLink) targetLink.click();
    }

    // Logo refresh animation
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            this.classList.add('refresh-anim');
            setTimeout(() => {
                window.location.reload();
            }, 800); // Wait for the animation to finish
        });
    }
});