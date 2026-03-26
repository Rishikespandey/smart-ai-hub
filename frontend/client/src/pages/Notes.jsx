import { useEffect, useState, useContext, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import axios from "axios"
import AuthContext from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Notes() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { setCredits } = useContext(AuthContext)

  const token = localStorage.getItem("token")

  // 🔥 LOAD HISTORY
  const loadHistory = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setHistory(res.data.notes || [])
    } catch (err) {
      console.error(err)
    }
  }, [token])

  // Fix: useEffect with loadHistory
  useEffect(() => {
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // 🔹 NEW NOTE
  const handleNewNote = () => {
    setText("")
    setSummary("")
    toast.success("New note created!")
    setSidebarOpen(false)
  }

  // 🔹 Summarize
  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to summarize")
      return
    }

    setLoading(true)
    setSummary("")

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes/summarize",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.data.success) {
        setSummary(res.data.message || "❌ Failed")
        toast.error(res.data.message || "Summarization failed")
        return
      }

      setSummary(res.data.summary)

      if (res.data.credits !== undefined) {
        setCredits(res.data.credits)
        if (res.data.credits < 5) {
          toast.warning(`⚠️ Only ${res.data.credits} credits remaining!`)
        } else {
          toast.success("Summary generated successfully!")
        }
      }

      loadHistory()

    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setSummary("❌ No credits remaining")
        toast.error("No credits remaining! Please purchase more.")
      } else {
        setSummary("❌ Error generating summary")
        toast.error("Failed to generate summary")
      }
    }

    setLoading(false)
  }

  // 🔹 Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // 🔹 Select history item
  const handleSelectHistory = (item) => {
    setText(item.originalText)
    setSummary(item.summary)
    toast.success("Note loaded")
    setSidebarOpen(false)
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
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - History */}
      <div className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 overflow-y-auto shadow-lg z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        <button
          onClick={handleNewNote}
          className="w-full bg-blue-600 p-2 rounded mb-4 hover:bg-blue-700 transition font-semibold"
        >
          + New Note
        </button>

        <h2 className="text-lg font-semibold mb-4">📜 History</h2>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No notes yet</p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelectHistory(item)}
                className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-sm transition-all"
              >
                <p className="text-xs text-gray-300 line-clamp-2">
                  {item.originalText?.substring(0, 60) || "Empty note"}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📝 Notes Summarizer
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Paste your notes and get AI-powered summaries
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your notes here..."
              className="w-full h-40 md:h-48 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              disabled={loading}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleSummarize}
                disabled={loading || !text.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Summarizing...
                  </div>
                ) : (
                  "✨ Summarize"
                )}
              </button>

              {text && (
                <button
                  onClick={() => copyToClipboard(text)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  📋 Copy Text
                </button>
              )}
            </div>
          </div>

          {/* Summary Output */}
          {summary && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-green-700 text-lg flex items-center gap-2">
                  <span>🤖</span> AI Summary
                </h2>
                <button
                  onClick={() => copyToClipboard(summary)}
                  className="text-sm text-green-600 hover:text-green-800 transition-colors"
                >
                  📋 Copy
                </button>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !summary && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}