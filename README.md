# AI Resume Analyzer 

A full-stack AI-powered web application that analyzes resumes against job descriptions and provides instant ATS (Applicant Tracking System) feedback, improvement suggestions, and missing keyword analysis.

🔗 **Live Demo:** https://ai-resume-analyzer-two-ruby.vercel.app

---

## What it does

- Upload your resume as a PDF
- Paste any job description
- Get instant AI-powered analysis including:
  - ATS compatibility score (out of 100)
  - Top strengths of your resume
  - Areas that need improvement
  - Missing keywords specific to the job description
- Every analysis is saved to a database for future reference

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- Multer (file upload handling)
- pdf-parse (PDF text extraction)

### Database
- MongoDB Atlas (cloud database)
- Mongoose (ODM)

### AI
- Groq API
- LLaMA 3.3 70B model

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Project Structure

```
AI-resume-analyzer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles (Tailwind)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js       # Vite + Tailwind config
│
├── backend/
│   ├── server.js            # Express server + all routes
│   ├── package.json
│   └── .env                 # Environment variables (not pushed)
│
└── README.md
```

---

## How it works

```
User uploads PDF + pastes job description
        ↓
React frontend sends POST request to /analyze
        ↓
Multer receives and holds the PDF file in memory
        ↓
pdf-parse extracts all text from the PDF
        ↓
Text + job description sent to Groq AI (LLaMA 3.3)
        ↓
AI returns structured JSON: atsScore, strengths, improvements, missingKeywords
        ↓
Result saved to MongoDB Atlas
        ↓
React displays results with Tailwind UI
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Health check — returns "Backend is running" |
| POST | `/analyze` | Accepts PDF + job description, returns AI analysis |

### POST /analyze

**Request (form-data):**
- `resume` — PDF file
- `jobDesc` — job description text (string)

**Response (JSON):**
```json
{
  "atsScore": 85,
  "strengths": [
    "Strong foundation in Data Structures and Algorithms",
    "Hands-on experience with MERN stack development",
    "AI/ML project experience"
  ],
  "improvements": [
    "Add more quantifiable achievements",
    "Include cloud deployment experience",
    "Highlight team collaboration"
  ],
  "missingKeywords": [
    "Docker",
    "AWS",
    "TypeScript",
    "CI/CD",
    "Agile"
  ]
}
```

---

## Database Schema

```javascript
const AnalysisSchema = new mongoose.Schema({
  filename: String,           // Name of uploaded PDF
  atsScore: Number,           // Score out of 100
  strengths: [String],        // Array of 3 strengths
  improvements: [String],     // Array of 3 improvements
  missingKeywords: [String],  // Array of 5 missing keywords
  createdAt: {
    type: Date,
    default: Date.now          // Auto timestamp
  }
})
```

---

## Running Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/keertan07/AI-resume-analyzer.git
cd AI-resume-analyzer
```

**2. Set up backend**
```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:
```
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```

Start the backend:
```bash
node server.js
```

Backend runs on `http://localhost:5000`

**3. Set up frontend**
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

**4. Open the app**

Go to `http://localhost:5173` in your browser.

---

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `MONGO_URI` | MongoDB Atlas connection string |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your backend URL (Render URL in production) |

---

## Deployment

### Backend on Render
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Add environment variables: `GROQ_API_KEY` and `MONGO_URI`

### Frontend on Vercel
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Add environment variable: `VITE_API_URL` = your Render backend URL

---

## Key Features

- **Real AI Analysis** — Uses LLaMA 3.3 70B via Groq for genuine resume feedback
- **Job-Specific Feedback** — Analysis is tailored to the specific job description provided
- **PDF Parsing** — Extracts raw text from any PDF resume automatically
- **Persistent Storage** — Every analysis saved to MongoDB with timestamp
- **Professional UI** — Dark theme with color-coded results (green/yellow/red)
- **Production Deployed** — Live URL, not just localhost

---

## What I Learned Building This

- How to build and connect a full MERN stack application
- How to handle file uploads with Multer
- How to extract text from PDFs programmatically
- How to integrate LLM APIs (Groq/OpenAI) into a backend
- How to store structured data in MongoDB using Mongoose
- How to deploy frontend and backend separately on Vercel and Render
- How environment variables work in production vs development
- How CORS works and why it's needed
- React hooks (useState) and how state drives UI updates
- How fetch API connects frontend to backend

---

## Author

**Keertan Singh**
- GitHub: [@keertan07](https://github.com/keertan07)
- LinkedIn: [KeertanSingh](https://linkedin.com/in/KeertanSingh)
- LeetCode: [Keertan3006](https://leetcode.com/Keertan3006)

---

## License

MIT License — feel free to use this project for learning or as a base for your own projects.
