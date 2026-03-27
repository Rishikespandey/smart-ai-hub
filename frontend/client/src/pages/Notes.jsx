import { useEffect, useState, useContext } from "react"
import axios from "axios"
import AuthContext from "../context/AuthContext"

export default function Notes() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const { setCredits } = useContext(AuthContext)

  const token = localStorage.getItem("token")

  // 🔥 LOAD HISTORY
  const loadHistory = async () => {
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
  }

  useEffect(() => {
    loadHistory()
  }, [token])

  // 🔹 NEW NOTE
  const handleNewNote = () => {
    setText("")
    setSummary("")
  }

  // 🔹 Summarize
  let handleSummarize = async () => {
    if (!text.trim()) return

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
        return
      }

      setSummary(res.data.summary)

      // 🔥 CREDIT UPDATE
      if (res.data.credits !== undefined) {
        setCredits(res.data.credits)
      }

      loadHistory()

    } catch (error) {
      console.error(error)

      if (error.response?.status === 403) {
        setSummary("❌ No credits remaining")
      } else {
        setSummary("❌ Error generating summary")
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] p-4 gap-4 max-w-7xl mx-auto w-full">

      {/* 🔥 Sidebar */}
      <div className="w-64 glass-panel flex flex-col p-4 shrink-0 hidden md:flex">

        <button
          onClick={handleNewNote}
          className="btn-primary w-full shadow-glow-strong mb-6"
        >
          + New Note
        </button>

        <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-3 px-2">History</h3>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {history.length === 0 ? (
             <p className="text-xs text-gray-500 text-center py-4 bg-black/20 rounded-lg border border-white/5">No notes yet</p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                className="p-3 rounded-xl cursor-pointer transition-all border bg-white/5 text-gray-300 border-transparent hover:bg-white/10 hover:text-white"
                onClick={() => {
                  setText(item.originalText)
                  setSummary(item.summary)
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">📝</span>
                  <span className="text-xs text-gray-400 truncate w-full">Note {item._id.slice(-4)}</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {item.originalText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔥 Main */}
      <div className="flex-1 glass-panel flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="w-full max-w-3xl relative z-10">

          <div className="bg-dark-800/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            
            {/* Subtle inner glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-2xl shadow-glow">
                📚
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                  Notes Summarizer
                </h1>
                <p className="text-sm text-gray-400 mt-1">Distill long articles and meetings into concise takeaways</p>
              </div>
            </div>

            {/* 🔹 Input */}
            <div className="mb-8 relative group/input">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-0 group-focus-within/input:opacity-30 transition duration-500 pointer-events-none"></div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your extensive meeting notes, article, or document here..."
                className="glass-input relative z-10 w-full h-56 resize-none text-base md:text-lg leading-relaxed bg-black/40 border-white/10 placeholder:text-gray-600 rounded-2xl p-5"
              />
            </div>

            {/* 🔹 Button */}
            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 shadow-glow group disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing context...
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300">✨</span>
                  Generate Summary
                </>
              )}
            </button>

            {/* 🟢 SUMMARY OUTPUT */}
            <div className={`transition-all duration-700 ${summary ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 hidden"}`}>
              {summary && (
                <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
                  
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-primary-500"></div>

                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-white/5 border border-white/10 text-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">🤖</span> 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Executive Summary</span>
                    </h2>

                    <div className="bg-white/5 border border-white/5 p-6 rounded-xl text-gray-200 leading-relaxed font-medium">
                      {summary.split('\n').map((line, i) => (
                        <p key={i} className={`mb-3 last:mb-0 ${line.startsWith('-') || line.startsWith('•') ? 'flex gap-2' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}