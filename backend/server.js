require('dotenv').config()

const express = require('express')
const cors = require('cors')

const multer = require('multer')
const pdfParse = require('@cyber2024/pdf-parse-fixed')

const Groq=require('groq-sdk')

const groq = new Groq({ apiKey: process.env.resume_analyzer })
const upload = multer({ storage: multer.memoryStorage() })

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running!')
})

app.post('/analyze',upload.single('resume') , async(req,res)=>{
    const pdfData=await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS resume analyzer. Analyze the resume and return a JSON object with: atsScore (number out of 100), strengths (array of 3 strings), improvements (array of 3 strings), missingKeywords (array of 5 strings).'
      },
      {
        role: 'user',
        content: `Analyze this resume: ${resumeText}`
      }
    ],
    response_format: { type: 'json_object' }
  })

  const analysis = JSON.parse(response.choices[0].message.content)
  res.json(analysis)
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
