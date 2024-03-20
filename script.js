import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener('DOMContentLoaded', initializeChat);

function initializeChat() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const API_KEY = "AIzaSyCuPnalHV9fUFTq2I_tt9SfxTXLrAbZmjw"; // Substitua "YOUR_API_KEY" pelo seu próprio API key
    const genAI = new GoogleGenerativeAI(API_KEY);
    let chat;

    const predefinedInput = "Gemini, Por favor, traduza o seguinte texto para o português: ";

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        showLoadingMessage();

        const fullMessage = predefinedInput + userMessage;
        appendMessage('user', fullMessage);

        if (!chat) {
            chat = genAI.getGenerativeModel({ model: "gemini-pro" }).startChat({
                generationConfig: {
                    maxOutputTokens: 30000,
                },
            });
        }

        const response = await chat.sendMessage(fullMessage);
        const textResponse = await response.response.text();
        appendMessage('model', textResponse);

        hideLoadingMessage();

        userInput.value = '';
    }

    function appendMessage(role, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add(role === 'user' ? 'user-message' : 'response-message');

        const textContainer = document.createElement('div');
        textContainer.textContent = message;
        textContainer.classList.add('message-text');

        messageContainer.appendChild(textContainer);
        chatMessages.appendChild(messageContainer);

        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showLoadingMessage() {
        const loadingMessage = createMessageElement('Traduzindo. Aguarde.', 'loading-message');
        chatMessages.appendChild(loadingMessage);
    }

    function hideLoadingMessage() {
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    function createMessageElement(text, className) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        messageElement.classList.add(className);
        return messageElement;
    }
}
