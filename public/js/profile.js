function initProfile() {
    const profileForm = document.getElementById('profile-form');
    const profilesCollection = document.getElementById('profiles-collection');

    if (!profileForm || !profilesCollection) return;

    // Load existing profiles from localStorage
    let savedProfiles = JSON.parse(localStorage.getItem('savedProfiles')) || [];

    // Filter out any corrupted/empty profiles previously saved due to bugs
    savedProfiles = savedProfiles.filter(p => p.name && p.age && p.gender);

    // Save the cleaned iteration back
    localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));

    // Render the profiles to the grid
    function renderProfiles() {
        profilesCollection.innerHTML = '';
        
        if (savedProfiles.length === 0) {
            profilesCollection.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No profiles saved yet. Add one above!</p>';
            return;
        }

        savedProfiles.forEach((profile, index) => {
            const card = document.createElement('div');
            card.classList.add('saved-profile-card');
            
            // Staggered animation delay based on index for a unique "pop-in" effect
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <h3>${profile.name} <span style="font-size:0.9rem; color:var(--text-light)">(${profile.age} yrs)</span></h3>
                <p><strong><i class="fas fa-venus-mars"></i> Gender:</strong> ${profile.gender}</p>
                <p><strong><i class="fas fa-notes-medical"></i> Diabetes Type:</strong> ${profile.diabetesType}</p>
                <p><strong><i class="fas fa-pills"></i> Meds:</strong> ${profile.medications || 'None specified'}</p>
                <button class="delete-btn" data-index="${index}" style="margin-top:10px; background:var(--danger-color); color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Delete</button>
            `;
            
            profilesCollection.appendChild(card);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                savedProfiles.splice(index, 1);
                localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
                renderProfiles();
            });
        });
    }

    // Handle new profile submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const gender = document.getElementById('gender').value;
        const diabetesType = document.getElementById('diabetes-type').value;
        const medications = document.getElementById('medications').value.trim();

        // Strict manual validation fallback to ensure no empty profiles are saved
        if (!name || !age || !gender || !diabetesType) {
            alert('Please fill out all required fields before saving.');
            return;
        }

        const newProfile = {
            name, age, gender, diabetesType, medications, dateAdded: new Date().toISOString()
        };

        savedProfiles.unshift(newProfile); // Add new to the top
        localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));

        // Reset form and re-render
        profileForm.reset();
        renderProfiles();
        
        // Temporarily change button text for UX feedback
        const btn = profileForm.querySelector('button[type="submit"]');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        btn.style.backgroundColor = 'var(--secondary-color)';
        setTimeout(() => {
            btn.innerHTML = oldText;
            btn.style.backgroundColor = '';
        }, 2000);
    });

    // Initial render
    renderProfiles();
}

// Support for the old logic if needed, but primary initialization is now initProfile
document.addEventListener('DOMContentLoaded', function() {
    initProfile(); // Double protection if script loaded independently
});