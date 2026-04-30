require('dotenv').config()


// VERY IMPORTANT: This block fixed the mognoDB connection issue  
const dns = require("dns");
//change DNS
dns.setServers(["1.1.1.1","8.8.8.8"]);

const express = require('express')
const cors = require('cors')

const multer = require('multer')
const pdfParse = require('@cyber2024/pdf-parse-fixed')

const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.resume_analyzer })
const upload = multer({ storage: multer.memoryStorage() })

const app = express()

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

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.post('/analyze', upload.single('resume'), async (req, res) => {
  const pdfData = await pdfParse(req.file.buffer)
  const resumeText = pdfData.text
  const jobDesc = req.body.jobDesc || 'No job description provided'

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS resume analyzer. Analyze the resume against the job description and return a JSON object with: atsScore (number out of 100), strengths (array of 3 strings), improvements (array of 3 strings), missingKeywords (array of 5 strings relevant to the job description).'
      },
      {
        role: 'user',
        content: `Job Description: ${jobDesc}\n\nResume: ${resumeText}`
      }
    ],
    response_format: { type: 'json_object' }
  })

  const analysis = JSON.parse(response.choices[0].message.content)
  try {
    await Analysis.create({
      filename: req.file.originalname,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      missingKeywords: analysis.missingKeywords
    })
    console.log('Analysis saved to MongoDB')
  } catch (dbError) {
    console.log('DB save error:', dbError.message)
  }
  res.json(analysis)
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
