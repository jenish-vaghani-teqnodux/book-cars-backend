import express from 'express'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const app = express()
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' })
})

// 🔥 VERY IMPORTANT PART
export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res)
}
