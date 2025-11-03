const css = `
    .chat-bot-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    }
    #chat-toggle-btn {
        background-color: var(--primary-color, #14eaf9);
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    #chat-toggle-btn:hover {
        transform: scale(1.1);
        background-color: #18d3e0;
    }
    .chat-window {
        position: absolute;
        bottom: 80px;
        left: 0;
        width: 350px;
        max-width: 90vw;
        height: 450px;
        background: var(--card-color, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        transform: scale(0.95) translateY(10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .chat-window.open {
        transform: scale(1) translateY(0);
        opacity: 1;
        visibility: visible;
    }
    .chat-header {
        background: var(--background-color, #121212);
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, #333);
        text-align: center;
        font-weight: 600;
    }
    .chat-header h4 {
        margin: 0;
        color: var(--text-primary, #fff);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    .chat-messages {
        flex-grow: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .chat-messages::-webkit-scrollbar {
        width: 6px;
    }
    .chat-messages::-webkit-scrollbar-thumb {
        background: var(--border-color, #333);
        border-radius: 3px;
    }
    .chat-message {
        padding: 0.6rem 1rem;
        border-radius: 12px;
        max-width: 80%;
        line-height: 1.5;
        color: var(--text-primary, #fff);
    }
    .chat-message a {
        color: var(--primary-color, #14eaf9);
        text-decoration: underline;
    }
    .bot-message {
        background: var(--background-color, #121212);
        align-self: flex-start;
        border-bottom-left-radius: 4px;
    }
    .user-message {
        background: var(--primary-color, #14eaf9);
        color: #121212;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }
    .chat-input-area {
        display: flex;
        padding: 0.75rem;
        border-top: 1px solid var(--border-color, #333);
        background: var(--background-color, #121212);
    }
    #chat-input {
        flex-grow: 1;
        border: 1px solid var(--border-color, #333);
        background: var(--card-color, #1a1a1a);
        border-radius: 8px;
        padding: 0.75rem;
        color: var(--text-primary, #fff);
        outline: none;
        margin-right: 0.5rem;
    }
    #chat-input:focus {
        border-color: var(--primary-color, #14eaf9);
    }
    #chat-send-btn {
        background: var(--primary-color, #14eaf9);
        border: none;
        color: #121212;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    #chat-send-btn:hover {
        background-color: #18d3e0;
    }
`;

const html = `
    <div class="chat-bot-container">
        <div class="chat-window">
            <div class="chat-header">
                <h4><i class="ri-sparkling-2-line"></i> Bay Breeze Helper</h4>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Ask a question..." />
                <button id="chat-send-btn" title="Send Message">
                    <i class="ri-send-plane-2-fill"></i>
                </button>
            </div>
        </div>
        <button id="chat-toggle-btn" title="Open Chat Helper">
            <i class="ri-question-answer-line"></i>
        </button>
    </div>
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = css;
document.head.appendChild(styleSheet);

document.body.insertAdjacentHTML("beforeend", html);

const chatToggleButton = document.getElementById("chat-toggle-btn");
const chatWindow = document.querySelector(".chat-window");
const messagesContainer = document.querySelector(".chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSendButton = document.getElementById("chat-send-btn");

let initialMessageSent = false;

chatToggleButton.addEventListener("click", () => {
  chatWindow.classList.toggle("open");
  if (chatWindow.classList.contains("open") && !initialMessageSent) {
    setTimeout(() => {
      addMessage(
        "Hello! I'm the Bay Breeze helper bot. How can I assist you? You can ask me about calculators, guides, or how to join.",
        "bot"
      );
    }, 300);
    initialMessageSent = true;
  }
});

const sendMessage = () => {
  const userQuery = chatInput.value.trim();
  if (userQuery === "") return;
  addMessage(userQuery, "user");
  chatInput.value = "";
  setTimeout(() => {
    const botResponse = getBotResponse(userQuery);
    addMessage(botResponse, "bot");
  }, 600);
};

chatSendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

const addMessage = (text, sender) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", `${sender}-message`);
  messageElement.innerHTML = text;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const getBotResponse = (query) => {
  const q = query.toLowerCase();

  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hello there! How can I help you navigate the Bay Breeze resources?";
  }
  if (
    q.includes("calc") ||
    q.includes("speedup") ||
    q.includes("gear") ||
    q.includes("shard") ||
    q.includes("rune") ||
    q.includes("skill book") ||
    q.includes("pet") ||
    q.includes("castle")
  ) {
    return `It sounds like you're looking for our calculators! We have a full suite of them on our <a href="/tools.html">Tools page</a>.`;
  }
  if (
    q.includes("guide") ||
    q.includes("strategy") ||
    q.includes("f2p") ||
    q.includes("resource") ||
    q.includes("morale") ||
    q.includes("relic") ||
    q.includes("event")
  ) {
    return `Looking for strategies? Our <a href="/resources.html">Resources page</a> has in-depth guides on Hero Mastery, Kingdom Foundations, and more.`;
  }
  if (q.includes("join") || q.includes("discord") || q.includes("guild")) {
    return "We'd love to have you! You can <a href='https://discord.gg/pXaNHAbz2E' target='_blank'>Join Our Discord</a> to become part of the Bay Breeze community.";
  }
  if (
    q.includes("leader") ||
    q.includes("razor") ||
    q.includes("officer") ||
    q.includes("badsmoke")
  ) {
    return `Our Guild Master is Razor. You can find a full list of our R4 Officers on the <a href="/index.html#members">Home page</a>.`;
  }
  if (
    q.includes("sky") ||
    q.includes("first r4") ||
    q.includes("first officer")
  ) {
    return "That's a fun bit of guild history! If you click on 'sky' on the homepage, you might find a special surprise. 😉";
  }
  if (
    q.includes("bug") ||
    q.includes("report") ||
    q.includes("hr") ||
    q.includes("suggestion") ||
    q.includes("idea")
  ) {
    return `If you've found a bug or have a suggestion, please use the <a href="/hr-report.html">Report to HR form</a>. We appreciate your feedback!`;
  }
  return "I'm not sure how to answer that. Try asking about 'calculators', 'guides', 'joining the guild', or how to 'report a bug'.";
};
