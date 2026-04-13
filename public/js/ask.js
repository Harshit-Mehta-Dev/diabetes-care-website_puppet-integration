document.addEventListener('DOMContentLoaded', function() {
    const askForm = document.getElementById('question-form');
    const questionsList = document.getElementById('questions-list');

    // Load history from localStorage
    let savedQuestions = JSON.parse(localStorage.getItem('savedQuestions')) || [];

    function renderQuestions() {
        if(!questionsList) return;
        questionsList.innerHTML = '';
        if (savedQuestions.length === 0) {
            questionsList.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No questions submitted yet.</p>';
            return;
        }

        savedQuestions.forEach(q => {
            const item = document.createElement('div');
            item.className = 'question-item';
            item.innerHTML = `
                <div class="question-title"><span style="color:var(--danger-color); font-size:0.8em; font-weight:bold;">[${(q.priority || 'Routine').toUpperCase()}]</span> ${q.title}</div>
                <div class="question-date">${new Date(q.date).toLocaleString()}</div>
                <div class="question-status status-pending">Sent to Doctor</div>
            `;
            questionsList.appendChild(item);
        });
    }

    renderQuestions();

    if (askForm) {
        askForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('question-email');
            const titleInput = document.getElementById('question-title');
            const detailsInput = document.getElementById('question-details');
            const priorityInput = document.getElementById('question-priority');
            const submitBtn = askForm.querySelector('button[type="submit"]');

            const email = emailInput ? emailInput.value : '';
            const title = titleInput.value;
            const details = detailsInput.value;
            const priority = priorityInput ? priorityInput.value : 'routine';

            // Simple validation
            if (!title || !details || !email) {
                alert('Please fill out all fields including your email.');
                return;
            }

            // UX update
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/ask-doctor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, title, details, priority })
                });

                const result = await response.json();

                if (response.ok) {
                    // Update history locally
                    savedQuestions.unshift({ title, details, priority, date: new Date().toISOString() });
                    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions));
                    renderQuestions();

                    // Success Feedback
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                    submitBtn.style.backgroundColor = 'var(--secondary-color)';
                    askForm.reset();
                } else {
                    alert('Error: ' + (result.error || 'Failed to send question'));
                    submitBtn.innerHTML = originalBtnText;
                }
            } catch (error) {
                console.error('Error submitting question:', error);
                alert('Network error. Please try again later.');
                submitBtn.innerHTML = originalBtnText;
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
});
