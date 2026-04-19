import { useState } from "react"

function App() {
  const [file,setFile] = useState(null)
  const [loading , setLoading ] = useState(false)
  const [result,setResult] = useState(null)

  return (
    <div>
      <h1>AI Resume Analyzer</h1>
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  )
}

export default App