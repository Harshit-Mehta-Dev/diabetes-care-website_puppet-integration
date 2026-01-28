// Profile functionality
function initProfile() {
    const profileForm = document.getElementById('profile-form');
    
    // Load saved profile data
    function loadProfile() {
        const savedProfile = localStorage.getItem('diabetesProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            document.getElementById('name').value = profile.name || '';
            document.getElementById('age').value = profile.age || '';
            document.getElementById('gender').value = profile.gender || '';
            document.getElementById('diabetes-type').value = profile.diabetesType || '';
            document.getElementById('medications').value = profile.medications || '';
            document.getElementById('pro').textContent = `Welcome, ${profile.name || 'User'}`;
        }
     
    }
    
    // Save profile data
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const profile = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            diabetesType: document.getElementById('diabetes-type').value,
            medications: document.getElementById('medications').value
        };
        
        localStorage.setItem('diabetesProfile', JSON.stringify(profile));
        
        // Show success message
        alert('Profile saved successfully!');
    });
    
    // Initialize
    loadProfile();
}