import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import uparrow from '../assets/uparrow.jpg';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}
    >
      <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
        {!isUser && message.severity && (
          <p className="severity-badge">Severity: {message.severity}</p>
        )}
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
    </div>
  );
};

export default function SymptomCheckerChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      text: `You are a professional medical assistant.
- Ask clarifying questions first.
- Use bullet points for recommendations.
- Use short, clear sentences.
- Always include a disclaimer that you are not a substitute for a doctor.`
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const userId = "671021c9b45e1c90495d1c6f";

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const pushMessage = (msg) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    pushMessage({ role: 'user', text: trimmed });
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, symptomsText: trimmed })
      });

      if (!res.ok) {
        const text = await res.text();
        pushMessage({ role: 'assistant', text: `Error from server: ${res.status} ${text}` });
        setIsSending(false);
        return;
      }

      const payload = await res.json();
      if (payload.ai_response) {
        pushMessage({
          role: 'assistant',
          text: payload.ai_response,
          severity: payload.severity || 'Mild'
        });
      } else {
        pushMessage({ role: 'assistant', text: payload.error || 'No valid response from AI.' });
      }
    } catch (err) {
      pushMessage({ role: 'assistant', text: `Network/error: ${err.message}` });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Symptom Checker</h2>
      </header>

      <main className="chat-main">
        {messages.filter(m => m.role !== 'system').map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef}></div>
      </main>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          className="chat-input"
        />
        <button type="submit" disabled={isSending} className="chat-button">
          {isSending ? 'Generating...' : <img src={uparrow} alt="Send" />}
        </button>
      </form>
    </div>
  );
}
