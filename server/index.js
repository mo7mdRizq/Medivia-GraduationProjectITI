import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'

dotenv.config({ path: './.env' })

const app = express()

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json())

app.get('/test', (req, res) => {
  res.json({ message: 'CORS WORKING ✅' })
})

app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
  console.log('🔗 CORS enabled for: http://localhost:5173')
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message)
  process.exit(1)
})
