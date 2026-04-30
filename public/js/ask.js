function initAsk() {
    const askForm = document.getElementById('question-form');
    const questionsList = document.getElementById('questions-list');

    if (!askForm || !questionsList) return;

    let savedQuestions = JSON.parse(localStorage.getItem('savedQuestions')) || [];

    function renderQuestions() {
        questionsList.innerHTML = '';
        if (savedQuestions.length === 0) {
            questionsList.innerHTML = '<p style="color: var(--text-light); font-style: italic;">No questions submitted yet.</p>';
            return;
        }

        savedQuestions.forEach(q => {
            const item = document.createElement('div');
            item.className = 'question-item';
            item.innerHTML = `
                <div class="question-title" style="font-weight: 600; color: var(--primary-color);">${q.title}</div>
                <div class="question-date" style="font-size: 0.8rem; color: var(--text-light);">${new Date(q.date).toLocaleString()}</div>
                <p style="font-size: 0.9rem; margin-top: 5px;">${q.details}</p>
                <div style="margin-top: 5px; font-size: 0.8rem; color: var(--secondary-color);">Status: Sent to Doctor</div>
            `;
            questionsList.appendChild(item);
        });
    }

    askForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const titleEl = document.getElementById('question-title');
        const detailsEl = document.getElementById('question-details');
        const emailEl = document.getElementById('question-email');
        const priorityEl = document.getElementById('question-priority');

        if (!titleEl || !detailsEl) return;

        const submitBtn = askForm.querySelector('button[type="submit"]');

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('api/ask-doctor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: titleEl.value, 
                    details: detailsEl.value,
                    email: emailEl ? emailEl.value : 'user@example.com',
                    priority: priorityEl ? priorityEl.value : 'routine'
                })
            });

            if (response.ok) {
                savedQuestions.unshift({ 
                    title: titleEl.value, 
                    details: detailsEl.value, 
                    date: new Date().toISOString() 
                });
                localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions));
                renderQuestions();
                askForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            }
        } catch (error) {
            console.error('Error submitting question:', error);
            // Fallback
            savedQuestions.unshift({ title: titleEl.value, details: detailsEl.value, date: new Date().toISOString() });
            localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions));
            renderQuestions();
            askForm.reset();
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Saved Local';
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    renderQuestions();
}
