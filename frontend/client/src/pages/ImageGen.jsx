import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateImage } from "../services/api"
import AuthContext from "../context/AuthContext"
import toast from "react-hot-toast"

export default function ImageGen() {

  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { setCredits } = useContext(AuthContext)

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("imageHistory")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const saveHistory = (newImage) => {
    setHistory((prev) => {
      try {
        const updated = [newImage, ...prev].slice(0, 5)
        localStorage.setItem("imageHistory", JSON.stringify(updated))
        toast.success("Image saved to history!")
        return updated
      } catch (err) {
        console.error("Storage full, clearing...", err)
        localStorage.removeItem("imageHistory")
        toast.error("Storage full, cleared history")
        return []
      }
    })
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    try {
      setLoading(true)
      setImage("")
      
      const res = await generateImage(prompt)

      if (!res?.success) {
        toast.error(res?.message || "Failed to generate image")
        return
      }

      setImage(res.image)
      saveHistory(res.image)
      
      if (res.credits !== undefined) {
        setCredits(res.credits)
        if (res.credits < 5) {
          toast.warning(`⚠️ Only ${res.credits} credits remaining!`)
        } else {
          toast.success("Image generated successfully!")
        }
      }

    } catch (err) {
      console.error(err)
      toast.error("Error generating image")
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setImage("")
    setPrompt("")
    toast.success("New session started!")
  }

  const handleSelectHistory = (img) => {
    setImage(img)
    toast.success("Image loaded from history")
    setSidebarOpen(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Prompt copied!")
  }

  const downloadImage = () => {
    if (image) {
      const link = document.createElement('a')
      link.href = image
      link.download = `ai-image-${Date.now()}.png`
      link.click()
      toast.success("Download started!")
    }
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

      {/* Sidebar - Image History */}
      <div className={`
        fixed lg:static top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 overflow-y-auto shadow-lg z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🖼️</span> Image History
          </h2>
          <button
            onClick={handleNew}
            className="text-xs bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition"
          >
            + New
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No images yet.<br />Generate your first image!
            </p>
          ) : (
            history.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSelectHistory(img)}
                className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all"
              >
                <img
                  src={img}
                  alt={`History ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎨 AI Image Generator
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Turn your imagination into stunning images
            </p>
          </motion.div>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Prompt
            </label>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., futuristic city, anime style, beautiful landscape, cyberpunk cat..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              rows="3"
              disabled={loading}
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Generating...
                  </div>
                ) : (
                  "✨ Generate Image"
                )}
              </motion.button>

              {prompt && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(prompt)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  📋 Copy Prompt
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Generated Image */}
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <span>🖼️</span> Generated Image
                  </h2>
                </div>
                
                <div className="p-5">
                  <img
                    src={image}
                    alt="generated"
                    className="rounded-lg shadow-lg w-full object-contain max-h-[400px]"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadImage}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      ⬇️ Download Image
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNew}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      🆕 Generate Another
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {loading && !image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-white rounded-xl shadow-lg p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="bg-gray-200 rounded-lg h-64 w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                🎨 AI is creating your masterpiece...
              </p>
            </motion.div>
          )}

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
          >
            <h3 className="text-sm font-semibold text-purple-700 mb-2">💡 Pro Tips</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "futuristic city",
                "anime style portrait",
                "cyberpunk cat",
                "watercolor landscape",
                "3D render",
                "oil painting"
              ].map((tip, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(tip)}
                  className="text-xs bg-white px-3 py-1 rounded-full border border-purple-300 text-purple-700 hover:bg-purple-100 transition"
                >
                  {tip}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}