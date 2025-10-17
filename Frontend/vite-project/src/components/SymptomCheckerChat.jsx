import React, { useState, useRef } from 'react';
import './SymptomCheckerChat.css';
import uparrow from "../assets/uparrow.jpg";

export default function SymptomCheckerChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
   { id: 1,
  role: 'system', 
  content: `You are a professional medical assistant. 
- Always ask clarifying questions before giving advice.
- Format questions and recommendations using bullet points.
- Avoid long paragraphs. Use short, clear sentences.
- Use markdown-style formatting for emphasis when needed.
- Always include a disclaimer that you're not a substitute for a doctor.` 
}

  ]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  const userId = "671021c9b45e1c90495d1c6f";

  function pushMessage(msg) {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), ...msg }]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  async function handleSend(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', text: trimmed };
    pushMessage(userMsg);
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
        pushMessage({ role: 'assistant', text: payload.ai_response });
      } else if (payload.error) {
        pushMessage({ role: 'assistant', text: `Error: ${payload.error}` });
      } else {
        pushMessage({ role: 'assistant', text: 'No valid response from AI.' });
      }
    } catch (err) {
      pushMessage({ role: 'assistant', text: `Network/error: ${err.message}` });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Symptom Checker</h2>
      </header>

      <main className="chat-main">
        {messages.filter(m => m.role !== 'system').map(m => (
          <div key={m.id} className="chat-message" style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div className={`chat-bubble ${m.role}`}>
              {m.text}
            </div>
          </div>
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
          {isSending ? 'Generating...' : <img src={uparrow} alt="Up arrow" height={"20px"} width={"20px"} />}
        </button>
      </form>
    </div>
  );
}