import React, { useState, useRef } from 'react';

export default function SymptomCheckerChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'system', text: 'You are a medical assistant. Ask clarifying questions before suggesting hospitals or booking.' }
  ]);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

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

    const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.text }));
    history.push({ role: 'user', content: trimmed });

    setIsSending(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      });

      if (!res.ok) {
        const text = await res.text();
        pushMessage({ role: 'assistant', text: `Error from server: ${res.status} ${text}` });
        setIsSending(false);
        return;
      }

      const payload = await res.json();
      if (payload.reply) pushMessage({ role: 'assistant', text: payload.reply });
      if (payload.function_call) handleFunctionCallResult(payload.function_call, payload.function_result || payload.arguments || {});
    } catch (err) {
      pushMessage({ role: 'assistant', text: `Network/error: ${err.message}` });
    } finally {
      setIsSending(false);
    }
  }

  function handleFunctionCallResult(functionCall, args) {
    const { name } = functionCall || {};

    if (name === 'get_hospitals' || name === 'list_hospitals') {
      const hospitals = args.hospitals || args.results || [];
      if (!Array.isArray(hospitals)) {
        pushMessage({ role: 'assistant', text: 'Received hospital data in an unexpected format.' });
        return;
      }
      pushMessage({ role: 'assistant', text: `Found ${hospitals.length} hospitals nearby:` });
      hospitals.forEach(h => pushMessage({ role: 'assistant', text: `${h.name} - ${h.distance || '?'} km away, Rating: ${h.rating || 'N/A'}` }));
      return;
    }

    if (name === 'book_hospital' || name === 'book_slot') {
      const booking = args.booking || args.confirmation || args.bookingConfirmation || args;
      const msgText = booking && booking.bookingId ? `Booking confirmed — ID: ${booking.bookingId}` : 'Booking confirmed';
      pushMessage({ role: 'assistant', text: msgText });
      return;
    }

    pushMessage({ role: 'assistant', text: `Function call: ${name} returned: ${JSON.stringify(args)}` });
  }

  async function handleBook(hospital) {
    pushMessage({ role: 'user', text: `Book appointment at ${hospital.name}` });
    setIsSending(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map(m => ({ role: m.role, content: m.text })),
          action: 'book_hospital',
          hospitalId: hospital.id
        })
      });

      const payload = await res.json();
      if (payload.reply) pushMessage({ role: 'assistant', text: payload.reply });
      if (payload.function_call) handleFunctionCallResult(payload.function_call, payload.function_result || payload.arguments || {});
    } catch (err) {
      pushMessage({ role: 'assistant', text: `Booking failed: ${err.message}` });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#f7f7f7' }}>
        <h2>Symptom Checker</h2>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#fafafa' }}>
        {messages.filter(m => m.role !== 'system').map(m => (
          <div key={m.id} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <div style={{ display: 'inline-block', backgroundColor: m.role === 'user' ? '#007bff' : '#eaeaea', color: m.role === 'user' ? 'white' : 'black', borderRadius: '8px', padding: '8px 12px', maxWidth: '80%' }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </main>

      <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isSending} style={{ marginLeft: '10px', padding: '8px 16px' }}>Send</button>
      </form>
    </div>
  );
}