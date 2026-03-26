import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import AuthContext from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Resume() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // 🔹 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      toast.success(`File selected: ${selectedFile.name}`)
    } else if (selectedFile) {
      toast.error("Please select a PDF file")
    }
  }

  // 🔹 Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      toast.success(`File selected: ${droppedFile.name}`)
    } else if (droppedFile) {
      toast.error("Please drop a PDF file")
    }
  }

  // 🔹 Upload Resume
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file")
      return
    }

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

      if (!res.data.success) {
        setAnalysis(res.data.message || "❌ Failed")
        toast.error(res.data.message || "Analysis failed")
        return
      }

      setAnalysis(res.data.analysis)

      // 🔥 CREDIT UPDATE with toast
      if (res.data.credits !== undefined) {
        setCredits(res.data.credits)
        if (res.data.credits < 5) {
          toast.warning(`⚠️ Only ${res.data.credits} credits remaining!`)
        } else {
          toast.success("Resume analyzed successfully!")
        }
      }

      loadHistory()

    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setAnalysis("❌ No credits remaining")
        toast.error("No credits remaining! Please purchase more.")
      } else {
        setAnalysis("❌ Error analyzing resume. Please try again.")
        toast.error("Failed to analyze resume")
      }
    }

    setLoading(false)
  }

  // 🔹 Load from history
  const handleSelectHistory = (item) => {
    setAnalysis(item.analysis)
    toast.success("Resume analysis loaded")
    setSidebarOpen(false)
  }

  // 🔹 Reset
  const handleNewResume = () => {
    setFile(null)
    setAnalysis("")
    toast.success("New resume session started!")
    setSidebarOpen(false)
  }

  // 🔹 Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // 🔹 Clear file
  const clearFile = () => {
    setFile(null)
    toast.success("File cleared")
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 🔥 Sidebar - History */}
      <div className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 overflow-y-auto shadow-lg z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">📄 Resume History</h2>
          <button
            onClick={handleNewResume}
            className="text-xs bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
          >
            + New
          </button>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No resumes analyzed yet</p>
          ) : (
            history.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => handleSelectHistory(item)}
                className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-sm transition-all"
              >
                <p className="text-xs text-gray-300 truncate">
                  {item.fileName || `Resume ${item._id.slice(-6)}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* 🔥 Main */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📄 Resume Analyzer
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Upload your resume (PDF) and get AI-powered analysis
            </p>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
            >
              <label
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center block cursor-pointer
                  transition-all duration-200
                  ${dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }
                  ${file ? "bg-green-50 border-green-400" : ""}
                `}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📄</span>
                  {file ? (
                    <>
                      <p className="text-green-600 font-medium">✓ File selected</p>
                      <p className="text-sm text-gray-600">{file.name}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          clearFile()
                        }}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-600 font-medium">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF files only (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Analyze Button */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={loading || !file}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Analyzing...
                  </div>
                ) : (
                  "🔍 Analyze Resume"
                )}
              </motion.button>

              {analysis && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(analysis)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  📋 Copy Analysis
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Analysis Output */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <span>📊</span> Analysis Result
                  </h2>
                </div>
                
                <div className="p-5 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none break-words">
                    <ReactMarkdown>
                      {analysis}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="border-t px-5 py-3 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(analysis)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy to clipboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {loading && !analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-white rounded-xl shadow-lg p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}