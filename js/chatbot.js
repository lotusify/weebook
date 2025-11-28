// ========== CHATBOT FEATURES ========== //
// Chatbot component loader and functionality

// ========== LOAD CHATBOT COMPONENT ========== //
// Run immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChatbotComponent);
} else {
    loadChatbotComponent();
}

function loadChatbotComponent() {
    // Load chatbot (only if not on excluded pages)
    const excludedPages = ['auth.html', 'admin.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!excludedPages.includes(currentPage)) {
        // Determine the correct path based on current location
        const isInInfoFolder = window.location.pathname.includes('/info/');
        const basePath = isInInfoFolder ? '../' : '';
        
        // Chatbot HTML content
        const chatbotHTML = `
            <div class="floating-chatbot" id="floatingChatbot">
                <div class="chatbot-toggle" onclick="toggleChatbot()">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <h4>AI Assistant</h4>
                        <button class="chatbot-close" onclick="toggleChatbot()">&times;</button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="message bot-message">
                            <div class="message-content">
                                <p>Xin chào! Tôi là AI Assistant của BookSelf. Tôi có thể giúp bạn tìm sách, trả lời câu hỏi về sản phẩm, hoặc hỗ trợ đặt hàng. Bạn cần gì?</p>
                                <span class="message-time" id="initialMessageTime"></span>
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatbotInput" placeholder="Nhập câu hỏi...">
                        <button onclick="sendChatbotMessage()">Gửi</button>
                    </div>
                    <div class="chatbot-actions">
                        <button class="btn-customer-service" onclick="chatWithCustomerService()">
                            <i class="fas fa-headset"></i>
                            Tôi muốn chat với CSKH
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
        if (chatbotPlaceholder) {
            chatbotPlaceholder.innerHTML = chatbotHTML;
            // Initialize chatbot timestamp after loading
            setTimeout(() => {
                initializeChatbotTimestamp();
            }, 100);
        }
    }
}

// ========== CHATBOT FUNCTIONS ========== //
function initializeChatbotTimestamp() {
    const initialMessageTime = document.getElementById('initialMessageTime');
    if (initialMessageTime) {
        initialMessageTime.textContent = new Date().toLocaleTimeString();
    }
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    
    if (chatbotWindow.style.display === 'block') {
        chatbotWindow.style.display = 'none';
        chatbotToggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
    } else {
        chatbotWindow.style.display = 'block';
        chatbotToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `
            <div class="message-content">
                <p>${getAIResponse(message)}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sách') || lowerMessage.includes('book')) {
        return 'Chúng tôi có rất nhiều loại sách. Bạn quan tâm đến thể loại nào? Văn học, kinh doanh, hay công nghệ?';
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
        return 'Giá sách của chúng tôi rất cạnh tranh, từ 50.000đ đến 500.000đ tùy loại. Bạn đang tìm mức giá nào?';
    } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
        return 'Chúng tôi giao hàng toàn quốc trong 2-5 ngày. Miễn phí ship cho đơn hàng trên 200.000đ!';
    } else if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
        return 'Chúng tôi hỗ trợ nhiều hình thức thanh toán: COD, chuyển khoản, thẻ tín dụng, ví điện tử.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('xin chào') || lowerMessage.includes('hi')) {
        return 'Xin chào! Tôi là trợ lý ảo của BookSelf. Tôi có thể giúp gì cho bạn?';
    } else {
        return 'Cảm ơn bạn đã liên hệ! Bạn muốn tôi giúp gì? Hoặc bạn có thể chat trực tiếp với nhân viên CSKH để được hỗ trợ tốt hơn.';
    }
}

function chatWithCustomerService() {
    const messages = document.getElementById('chatbotMessages');
    
    // Add bot message
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.innerHTML = `
        <div class="message-content">
            <p>Chuyển bạn đến chat với nhân viên CSKH. Vui lòng đợi trong giây lát...</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(botMessage);
    
    // Simulate connecting to customer service
    setTimeout(() => {
        const csMessage = document.createElement('div');
        csMessage.className = 'message bot-message';
        csMessage.innerHTML = `
            <div class="message-content">
                <p>Xin chào! Tôi là nhân viên CSKH. Tôi có thể giúp gì cho bạn?</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(csMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 2000);
    
    messages.scrollTop = messages.scrollHeight;
}

// Add Enter key support for chatbot
function initializeChatbotEnterKey() {
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatbotMessage();
            }
        });
    }
}

function openChat() {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        showNotification('Vui lòng đăng nhập để chat!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    // Open chat modal
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.style.display = 'flex';
    } else {
        createChatModal();
    }
}

function createChatModal() {
    const modal = document.createElement('div');
    modal.id = 'chatModal';
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="chat-modal-content">
            <div class="chat-header">
                <h3>Chat với OMEGA BOOKS</h3>
                <button class="close-chat" onclick="closeChat()">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <div class="message-content">
                        <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Nhập tin nhắn...">
                <button onclick="sendMessage()">Gửi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeChat() {
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `
            <div class="message-content">
                <p>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong giây lát.</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.loadChatbotComponent = loadChatbotComponent;
    window.initializeChatbotTimestamp = initializeChatbotTimestamp;
    window.initializeChatbotEnterKey = initializeChatbotEnterKey;
    window.toggleChatbot = toggleChatbot;
    window.sendChatbotMessage = sendChatbotMessage;
    window.chatWithCustomerService = chatWithCustomerService;
    window.openChat = openChat;
    window.closeChat = closeChat;
    window.sendMessage = sendMessage;
}
