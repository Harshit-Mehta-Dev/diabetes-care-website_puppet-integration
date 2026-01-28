// Chatbot functionality
function initChatbot() {
    const chatMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        
        messageDiv.appendChild(messageText);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Process user input
    async function processInput() {
        const text = userInput.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chatbot-message', 'bot');
        typingIndicator.innerHTML = '<p><i class="fas fa-ellipsis-h"></i></p>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);

            addMessage(data.reply, false);
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            addMessage('Sorry, something went wrong. Please try again.', false);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', processInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') processInput();
    });
    
    // Initial greeting
    setTimeout(() => {
        addMessage("You can ask me about managing high or low blood sugar levels, diet recommendations, exercise tips, or medications.", false);
    }, 1500);
}
