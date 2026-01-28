// Chatbot functionality
function initChatbot() {
    const chatMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Sample responses (in a real app, replace with API calls)
    const sampleResponses = {
        "Hello":"Hello !, Sir how can i help you",
        "high sugar": "For high sugar levels, consider taking your prescribed medication (like Metformin). Try drinking plenty of water and eating high-fiber foods like vegetables. A 15-minute walk can also help lower blood sugar.",
        "low sugar": "For low sugar levels, consume 15-20 grams of fast-acting carbs (like juice or glucose tablets). Follow up with a protein-rich snack. Avoid over-treating as it can cause high sugar later.",
        "diet": "A balanced diabetic diet includes non-starchy vegetables, lean proteins, whole grains, and healthy fats. Limit processed foods and sugars. Consider the plate method: 1/2 plate veggies, 1/4 protein, 1/4 whole grains.",
        "exercise": "Regular exercise helps manage diabetes. Try 30 minutes of moderate activity daily (walking, swimming, cycling). Yoga poses like seated forward bend and cobra can help with blood sugar control.",
        "medication": "Common diabetes medications include Metformin, Insulin, Sulfonylureas, and SGLT2 inhibitors. Always follow your doctor's prescription and timing instructions.",
        "who are you": "Am a chatbot devlop by Anmol, Prince, Ankit.",
        "default": "I'm here to help with diabetes management. You can ask me about high/low sugar levels, diet recommendations, exercise tips, or medications. How can I assist you today?"
    };
    
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
    function processInput() {
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
        
        // Simulate API delay
        setTimeout(() => {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            let response = sampleResponses.default;
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('high') || lowerText.includes('hyperglycemia')) {
                response = sampleResponses["high sugar"];
            } else if (lowerText.includes('low') || lowerText.includes('hypoglycemia')) {
                response = sampleResponses["low sugar"];
            } else if (lowerText.includes('diet') || lowerText.includes('eat') || lowerText.includes('food')) {
                response = sampleResponses["diet"];
            } else if (lowerText.includes('exercise') || lowerText.includes('yoga') || lowerText.includes('walk')) {
                response = sampleResponses["exercise"];
            } else if (lowerText.includes('medication') || lowerText.includes('pill') || lowerText.includes('drug')) {
                response = sampleResponses["medication"];
            }else if (lowerText.includes('who') || lowerText.includes('Anmol') || lowerText.includes('Prince')) {
                response = sampleResponses["who are you"];
            }
            
            addMessage(response, false);
        }, 1000);
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
