import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import axios from 'axios'

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message))

// Test route
app.get('/', (req, res) => res.send('Backend is running'))

// Analyze route
app.post('/api/analyze', async (req, res) => {
  try {
    const { history } = req.body
    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'Invalid request format' })
    }

    const lastUserMessage = history[history.length - 1]?.content || ''
    const context = history.map(m => `${m.role}: ${m.content}`).join('\n')

    const prompt = `
You are a medical assistant. Be friendly, concise, and helpful.
Only suggest seeing a doctor if symptoms are serious.

Conversation:
${context}
User's latest message: "${lastUserMessage}"
    `

    // Call Google Generative Language API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const reply = response.data?.candidates?.[0]?.content?.[0]?.text || 'No response generated'
    res.json({ reply })

  } catch (err) {
    console.error('❌ Error in /api/analyze:', err.response?.data || err.message)
    res.status(500).json({ error: err.response?.data || err.message })
  }
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
