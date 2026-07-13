require('dotenv').config()


// VERY IMPORTANT: This block fixed the mognoDB connection issue  
const dns = require("dns");
//change DNS
//dns.setServers(["1.1.1.1","8.8.8.8"]);

const express = require('express')
const cors = require('cors')

const multer = require('multer')
const pdfParse = require('@cyber2024/pdf-parse-fixed')

const Groq = require('groq-sdk')

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const groq = new Groq({
  apiKey: process.env.resume_analyzer,
  timeout: 20 * 1000, // 20 seconds
})
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are accepted.'))
    }
    cb(null, true)
  },
})

import rateLimit from 'express-rate-limit'//updated

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP per window
  message: { error: 'Too many requests. Please try again later.' },
})

const app = express()

app.use('/analyze', limiter)

const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err))

const AnalysisSchema = new mongoose.Schema({
  filename: String,
  atsScore: Number,
  strengths: [String],
  improvements: [String],
  missingKeywords: [String],
  createdAt: { type: Date, default: Date.now }
})

const Analysis = mongoose.model('Analysis', AnalysisSchema)

app.use(cors({//updated
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {//updated
    if (!req.file) {//updated
      return res.status(400).json({ error: 'No resume file uploaded.' })
    }
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text
    const jobDesc = req.body.jobDesc || 'No job description provided'

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert ATS resume analyzer. Analyze the resume against the job description and return a JSON object with: atsScore (number out of 100), strengths (array of 3 strings), improvements (array of 3 strings), missingKeywords (array of 5 strings relevant to the job description).'
        },
        {
          role: 'user',
          content: `Job Description: ${jobDesc}\n\nResume: ${resumeText}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0].message.content
    const result = JSON.parse(content)

    try {//updated
      await Analysis.create({
        filename: req.file.originalname,
        atsScore: result.atsScore,
        strengths: result.strengths,
        improvements: result.improvements,
        missingKeywords: result.missingKeywords
      })
      console.log('Analysis saved to MongoDB')
    } catch (dbError) {//treating DB failure as non-fatal (analysis still shown to user, but warn them):
      console.error('DB save error:', dbError.message)
      // still return the result but flag it
      return res.json({ ...result, saved: false })
    }

    res.json(result)

  } catch (err) {//updated
    console.error(err)
    res.status(500).json({
      error: 'Analysis failed. Please try again.'
    })
  }
})

app.use((err, req, res, next) => {//updated
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  }

  if (err.message === 'Only PDF files are accepted.') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
