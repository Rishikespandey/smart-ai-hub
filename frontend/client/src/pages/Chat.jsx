import { useEffect, useState, useRef, useContext } from "react"
import { sendChatMessage, fetchChats } from "../services/api"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import AuthContext from "../context/AuthContext"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [chatList, setChatList] = useState([])
  const [chatId, setChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  const { setCredits } = useContext(AuthContext)

  const navigate = useNavigate()
  const bottomRef = useRef(null)

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")
  }, [navigate])

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 🔹 Load chats
  const loadChats = async () => {
    try {
      const res = await fetchChats()
      if (res?.success) setChatList(res.chats || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadChats()
  }, [])

  // 🔹 Send message
  const handleSend = async () => {
    if (!message.trim() || loading || cooldown) return

    const userMsg = message
    setMessage("")
    setLoading(true)
    setCooldown(true)

    const aiId = Date.now()

    // 🔥 Add user + loading message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, id: Date.now() + 1 },
      { role: "ai", content: "⏳ Thinking...", id: aiId }
    ])

    try {
      const res = await sendChatMessage(userMsg, chatId)

      // ✅ HANDLE FAIL CASE
      if (!res?.success) {
        const errorMsg = res?.message || "❌ Failed"

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId
              ? { ...msg, content: errorMsg }
              : msg
          )
        )
        return
      }

      // ✅ SUCCESS CASE
      const aiText = res.reply || "No response"

      // 🔥 CREDIT UPDATE
      if (res.credits !== undefined) {
        setCredits(res.credits)
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: String(aiText) }
            : msg
        )
      )

      loadChats()

    } catch (err) {
      console.error(err)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: "❌ Server error" }
            : msg
        )
      )
    }

    setTimeout(() => {
      setCooldown(false)
    }, 3000)

    setLoading(false)
  }

  // 🔹 Copy text
  const copyText = (text, index) => {
    navigator.clipboard.writeText(text || "")

    setMessages((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], copied: true }
      return updated
    })

    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], copied: false }
        return updated
      })
    }, 1500)
  }

  // 🔹 Select chat
  const handleSelectChat = (chat) => {
    setChatId(chat._id)
    setMessages(chat.messages || [])
  }

  // 🔹 New chat
  const handleNewChat = () => {
    setChatId(null)
    setMessages([])
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 relative z-10">

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-72 glass-panel p-4 h-full relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] pointer-events-none"></div>

        <button
          onClick={handleNewChat}
          className="btn-primary w-full py-3 mb-6 font-semibold flex items-center justify-center gap-2 shadow-glow"
        >
          <span>✏️</span> New Chat
        </button>

        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Recent Conversations
        </h3>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
          {chatList.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`p-3 rounded-xl cursor-pointer text-sm transition-all border ${
                chatId === chat._id
                  ? "bg-primary-500/20 border-primary-500/30 text-primary-300"
                  : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            >
              <div className="truncate flex items-center gap-2">
                <span className="text-gray-500">💬</span> Chat {chat._id.slice(-6)}
              </div>
            </div>
          ))}
          {chatList.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No recent chats.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full glass-panel relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow text-xl">
              🤖
            </div>
            <div>
              <h2 className="font-semibold text-white">SmartAI Assistant</h2>
              <p className="text-xs text-primary-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="text-6xl mb-4 grayscale">👋</div>
              <h3 className="text-xl font-bold text-white mb-2">How can I help you today?</h3>
              <p className="text-gray-400 text-sm max-w-sm">Ask me to write code, compose an email, or spark your imagination.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-slide-up origin-bottom`}
            >
              <div
                className={`relative px-5 py-3.5 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm md:text-base leading-relaxed tracking-wide shadow-lg group ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary-600/80 to-accent-600/80 text-white rounded-br-sm border border-primary-400/20"
                    : "bg-white/5 text-gray-200 rounded-bl-sm border border-white/10 backdrop-blur-md"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-dark-900/80 prose-pre:border prose-pre:border-white/10">
                  <ReactMarkdown>
                    {String(msg.content || "")}
                  </ReactMarkdown>
                </div>

                {msg.role === "ai" && (
                  <button
                    onClick={() => copyText(msg.content, i)}
                    className="absolute bottom-2 right-[-60px] text-xs text-gray-500 hover:text-white bg-dark-800/80 border border-white/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {msg.copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-dark-800/50 border-t border-white/10 z-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message SmartAI..."
              className="w-full bg-black/40 text-white border border-white/10 rounded-full pl-6 pr-24 py-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || cooldown || !message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-glow transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span className="translate-x-[-1px] mb-[1px]">➔</span>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3 hidden md:block">
            SmartAI can make mistakes. Consider verifying important information.
          </p>
        </div>

      </div>
    </div>
  )
}