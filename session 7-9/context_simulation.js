// context_simulation.js
// Simulating a chat system with a limited context window

// Step 1: Create an array to store chat messages
let history = [];

// Step 2: Set the maximum context limit (number of messages remembered)
const CONTEXT_LIMIT = 5; // you can adjust this number

// Step 3: Function to add a message to chat history
function addMessage(sender, message) {
  const newMessage = { sender, message, timestamp: new Date().toISOString() };
  history.push(newMessage);

  // Step 4: If chat exceeds the limit, remove oldest messages
  if (history.length > CONTEXT_LIMIT) {
    history.shift(); // removes the oldest message
  }
}

// Step 5: Simulate a conversation
function simulateChat() {
  addMessage("User", "Hello!");
  addMessage("Bot", "Hi there! How can I help you?");
  addMessage("User", "Tell me a joke.");
  addMessage("Bot", "Why did the programmer quit his job? Because he didn't get arrays!");
  addMessage("User", "Haha, nice one!");
  addMessage("Bot", "Glad you liked it!");
  addMessage("User", "What’s the time now?");
  addMessage("Bot", "It's always code o’clock!");
  addMessage("User", "Hi again!");

  console.log("Current Chat Context:");
  console.table(history);
}

simulateChat();
