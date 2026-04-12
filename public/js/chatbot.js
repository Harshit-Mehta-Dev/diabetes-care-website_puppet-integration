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
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            // Remove typing indicator right when connection opens
            chatMessages.removeChild(typingIndicator);

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                addMessage(data.error || "The server encountered an error processing your request.", false);
                return;
            }

            // Create initial empty message bubble for the stream
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chatbot-message', 'bot');
            const messageText = document.createElement('p');
            messageDiv.appendChild(messageText);
            chatMessages.appendChild(messageDiv);

            // Read the stream chunk by chunk
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6); // remove 'data: '
                        if (dataStr === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.error) {
                                messageText.textContent += "\n[Error: " + parsed.error + "]";
                            } else if (parsed.text) {
                                messageText.textContent += parsed.text;
                                chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll with text
                            }
                        } catch(e) {
                            // Ignored parse error on incomplete chunks
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error streaming chatbot response:', error);
            // If typing indicator hasn't been removed yet
            if (chatMessages.contains(typingIndicator)) {
                chatMessages.removeChild(typingIndicator);
            }
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
