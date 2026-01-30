document.addEventListener('DOMContentLoaded', function() {
    const changePictureBtn = document.getElementById('change-picture-btn');
    const profilePicture = document.querySelector('.profile-picture');

    if (changePictureBtn) {
        changePictureBtn.addEventListener('click', function() {
            const newPicture = prompt('Enter the URL of your new profile picture:');
            if (newPicture) {
                profilePicture.src = newPicture;
            }
        });
    }
});