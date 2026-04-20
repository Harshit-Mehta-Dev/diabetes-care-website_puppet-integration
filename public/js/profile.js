function initProfile() {
    const profileForm = document.getElementById('profile-form');
    const profilesCollection = document.getElementById('profiles-collection');
    const proTitle = document.getElementById('pro');

    // Load existing profiles
    let savedProfiles = JSON.parse(localStorage.getItem('savedProfiles')) || [];

    function renderProfiles() {
        // Only render if a gallery container exists
        if (profilesCollection) {
            profilesCollection.innerHTML = '';
            if (savedProfiles.length === 0) {
                profilesCollection.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No profiles saved yet.</p>';
            } else {
                savedProfiles.forEach((profile, index) => {
                    const card = document.createElement('div');
                    card.classList.add('saved-profile-card');
                    card.innerHTML = `
                        <h3>${profile.name} (${profile.age})</h3>
                        <p>Type: ${profile.diabetesType.toUpperCase()}</p>
                        <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                    `;
                    profilesCollection.appendChild(card);
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        savedProfiles.splice(index, 1);
                        localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
                        renderProfiles();
                    });
                });
            }
        }

        // Update greeting if element and profiles exist
        if (proTitle) {
            proTitle.textContent = savedProfiles.length > 0 ? `Welcome back, ${savedProfiles[0].name}!` : '';
        }
    }

    // Handle new profile submission
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameEl = document.getElementById('name');
            const ageEl = document.getElementById('age');
            const genderEl = document.getElementById('gender');
            const diabetesTypeEl = document.getElementById('diabetes-type');
            const medsEl = document.getElementById('medications');

            if (!nameEl || !ageEl || !genderEl || !diabetesTypeEl) return;

            const newProfile = {
                name: nameEl.value,
                age: ageEl.value,
                gender: genderEl.value,
                diabetesType: diabetesTypeEl.value,
                medications: medsEl ? medsEl.value : '',
                dateAdded: new Date().toISOString()
            };

            savedProfiles.unshift(newProfile);
            localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
            
            alert('Profile saved successfully!');
            renderProfiles();
        });
    }

    // BMI logic (Optional)
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiDisplay = document.getElementById('bmi-display');

    if (heightInput && weightInput && bmiDisplay) {
        const calculateBMI = () => {
            const h = parseFloat(heightInput.value) / 100;
            const w = parseFloat(weightInput.value);
            if (h > 0 && w > 0) {
                const bmi = (w / (h * h)).toFixed(1);
                bmiDisplay.value = bmi;
            }
        };
        heightInput.addEventListener('input', calculateBMI);
        weightInput.addEventListener('input', calculateBMI);
    }

    renderProfiles();
}