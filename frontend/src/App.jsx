import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const[jobDesc,setjobDesc] = useState("")

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select a file first')
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDesc',jobDesc)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-2">
        AI Resume Analyzer
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Upload your resume and get instant ATS feedback
      </p>

      {/* Upload Box */}
      <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl p-8 mb-8">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-gray-300 mb-4"
        />
        <textarea placeholder="Paste the job description here..."
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full bg-gray-800 text-gray-300 rounded-xl p-3 mt-2 h-32 resize-none"
        />
        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ATS Score */}
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-1">ATS Score</p>
            <p className="text-6xl font-bold text-blue-400">
              {result.atsScore}
              <span className="text-2xl text-gray-500">/100</span>
            </p>
          </div>

          {/* Strengths */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-green-400 font-semibold text-lg mb-3">
              Strengths
            </h2>
            <ul className="space-y-2">
              {result.strengths.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-yellow-400 font-semibold text-lg mb-3">
              Improvements
            </h2>
            <ul className="space-y-2">
              {result.improvements.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-yellow-400 mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-red-400 font-semibold text-lg mb-3">
              Missing Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((item, index) => (
                <span key={index} className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default App