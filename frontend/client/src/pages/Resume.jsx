import { useState, useContext, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import AuthContext from "../context/AuthContext"

export default function Resume() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const { setCredits } = useContext(AuthContext)

  const token = localStorage.getItem("token")

  // 🔥 LOAD HISTORY
  const loadHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/resume",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setHistory(res.data.resumes || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  // 🔹 Upload Resume
  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("resume", file)

    try {
      setLoading(true)
      setAnalysis("")

      const res = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      setAnalysis(res.data.analysis)

      // 🔥 CREDIT UPDATE
      if (res.data.credits !== undefined) {
        setCredits(res.data.credits)
      }

      loadHistory() // 🔥 refresh history

    } catch (err) {
      console.error(err)
      setAnalysis("❌ Error analyzing resume")
    }

    setLoading(false)
  }

  // 🔹 Load from history
  const handleSelectHistory = (item) => {
    setAnalysis(item.analysis)
  }

  // 🔹 Reset
  const handleNewResume = () => {
    setFile(null)
    setAnalysis("")
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] p-4 gap-4 max-w-7xl mx-auto w-full">

      {/* 🔥 Sidebar */}
      <div className="w-64 glass-panel flex flex-col p-4 shrink-0 hidden md:flex">

        <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-3 px-2">
          Resume History
        </h3>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4 bg-black/20 rounded-lg">No history</p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectHistory(item)}
                className="p-3 rounded-xl cursor-pointer transition-all border bg-white/5 text-gray-300 border-transparent hover:bg-white/10 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <span className="text-sm truncate">Resume {item._id.slice(-4)}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* 🔥 Main Area */}
      <div className="flex-1 glass-panel flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="w-full max-w-3xl relative z-10">

          <div className="bg-dark-800/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            
            {/* Subtle glow inside card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-2xl shadow-glow">
                  📄
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">Resume AI</h1>
                  <p className="text-sm text-gray-400 mt-1">Upload your PDF for instant ATS feedback</p>
                </div>
              </div>

              <button
                onClick={handleNewResume}
                className="btn-outline text-sm px-4 py-2 hover:bg-white/10"
              >
                + New Resume
              </button>
            </div>

            {/* Upload Area */}
            <label className="relative border-2 border-dashed border-white/20 hover:border-primary-500/50 bg-black/40 hover:bg-black/60 transition-all duration-300 p-12 text-center block rounded-2xl cursor-pointer mb-8 group/dropzone overflow-hidden">
              
              {/* Dropzone inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-500/5 opacity-0 group-hover/dropzone:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl group-hover/dropzone:scale-110 group-hover/dropzone:-translate-y-2 group-hover/dropzone:bg-primary-500/20 group-hover/dropzone:text-primary-400 group-hover/dropzone:shadow-glow transition-all duration-300 border border-white/10">
                  📤
                </div>
                <div>
                  <p className="text-gray-300 font-medium group-hover/dropzone:text-white text-lg transition-colors">
                    Click to browse files or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Supports exactly .PDF</p>
                </div>

                {file && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 animate-slide-up">
                    <span className="text-green-400 text-sm font-medium pr-2 border-r border-green-500/30">Selected</span>
                    <span className="text-gray-300 text-sm max-w-[200px] truncate">{file.name}</span>
                  </div>
                )}
              </div>
            </label>

            {/* Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-glow transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing constraints...
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">✨</span>
                  Analyze Resume
                </>
              )}
            </button>

            {/* Output */}
            {analysis && (
              <div className="mt-8 animate-slide-up bg-black/40 border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>

                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-white/5 border border-white/10 text-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">📊</span> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Analysis Results</span>
                  </h2>

                  <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-white prose-li:text-gray-300 prose-li:marker:text-primary-500 prose-strong:text-primary-300 max-w-none break-words">
                      <ReactMarkdown>
                        {analysis}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  )
}