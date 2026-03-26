import { useEffect, useState, useRef, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sendChatMessage, fetchChats } from "../services/api"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import AuthContext from "../context/AuthContext"
import toast from "react-hot-toast"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [chatList, setChatList] = useState([])
  const [chatId, setChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, id: Date.now() + 1 },
      { role: "ai", content: "⏳ Thinking...", id: aiId, isLoading: true }
    ])

    try {
      const res = await sendChatMessage(userMsg, chatId)

      if (!res?.success) {
        const errorMsg = res?.message || "❌ Failed"

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId
              ? { ...msg, content: errorMsg, isLoading: false }
              : msg
          )
        )
        toast.error(errorMsg)
        return
      }

      const aiText = res.reply || "No response"

      if (res.credits !== undefined) {
        setCredits(res.credits)
        if (res.credits < 5) {
          toast.warning(`⚠️ Only ${res.credits} credits remaining!`)
        } else {
          toast.success("Response received!")
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: String(aiText), isLoading: false }
            : msg
        )
      )

      loadChats()

    } catch (err) {
      console.error(err)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: "❌ Server error", isLoading: false }
            : msg
        )
      )
      toast.error("Network error")
    }

    setTimeout(() => {
      setCooldown(false)
    }, 3000)

    setLoading(false)
  }

  // 🔹 Copy text with toast
  const copyText = (text, index) => {
    navigator.clipboard.writeText(text || "")

    setMessages((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], copied: true }
      return updated
    })
    
    toast.success("Copied to clipboard!")

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
    toast.success("Chat loaded")
    setSidebarOpen(false)
  }

  // 🔹 New chat
  const handleNewChat = () => {
    setChatId(null)
    setMessages([])
    toast.success("New chat started!")
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-200">
      
      {/* Mobile Menu Button - Sirf mobile pe dikhega */}
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

      {/* Sidebar - Desktop pe hamesha dikhega, mobile pe toggle se */}
      <div className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col shadow-lg z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        <button
          onClick={handleNewChat}
          className="bg-blue-600 p-2 rounded mb-4 hover:bg-blue-700 transition font-semibold"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chatList.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No chats yet</p>
          ) : (
            chatList.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`p-2 rounded cursor-pointer text-sm transition ${
                  chatId === chat._id 
                    ? "bg-blue-600" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <p className="truncate">Chat {chat._id.slice(-4)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {chat.messages?.length || 0} messages
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 md:p-4 font-semibold shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🚀</span>
              <span className="text-sm md:text-base">SmartAI Chat</span>
            </div>
            <div className="text-xs md:text-sm bg-white/20 px-2 md:px-3 py-1 rounded-full">
              {chatId ? "Active" : "New Chat"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-100">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="text-5xl md:text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-sm md:text-base">Start a conversation</p>
                <p className="text-gray-400 text-xs md:text-sm mt-2">Ask me anything!</p>
              </motion.div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm shadow-md relative ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : msg.content?.includes("❌") 
                        ? "bg-red-100 text-red-700"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                        />
                        <span className="text-xs md:text-sm">{msg.content}</span>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-1">
                        <ReactMarkdown>
                          {String(msg.content || "")}
                        </ReactMarkdown>
                      </div>
                    )}

                    {msg.role === "ai" && !msg.isLoading && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyText(msg.content, i)}
                        className="absolute top-1 right-1 md:top-2 md:right-2 text-xs text-gray-400 hover:text-black"
                      >
                        {msg.copied ? "✅" : "📋"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Typing Indicator */}
          {cooldown && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-200 rounded-2xl px-3 md:px-4 py-2">
                <div className="flex gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-3 md:p-4 bg-white border-t flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={cooldown ? "Please wait..." : "Ask anything..."}
            className="flex-1 border rounded-full px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={cooldown}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || cooldown}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 rounded-full text-sm md:text-base disabled:opacity-50"
          >
            {loading ? "⏳" : cooldown ? "⏱️" : "Send"}
          </motion.button>
        </motion.div>

      </div>
    </div>
  )
}