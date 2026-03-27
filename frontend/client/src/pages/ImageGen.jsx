import { useState, useContext } from "react"
import { generateImage } from "../services/api"
import Sidebar from "../components/Sidebar"
import AuthContext from "../context/AuthContext"

export default function ImageGen() {

  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  const { setCredits } = useContext(AuthContext)

  // ✅ Load history (safe)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("imageHistory")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ✅ Save history (FIXED 🔥)
  const saveHistory = (newImage) => {
    setHistory((prev) => {
      try {
        const updated = [newImage, ...prev].slice(0, 3) // 🔥 LIMIT FIX
        localStorage.setItem("imageHistory", JSON.stringify(updated))
        return updated
      } catch (err) {
        console.error("Storage full, clearing...", err)
        localStorage.removeItem("imageHistory") // auto fix
        return []
      }
    })
  }

  // 🔥 Generate Image
  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)

      const res = await generateImage(prompt)

      if (!res?.success) {
        alert("❌ Failed to generate image")
        return
      }

      setImage(res.image)
      saveHistory(res.image)
      setCredits(res.credits)

    } catch (err) {
      console.error(err)
      alert("❌ Error generating image")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 New button
  const handleNew = () => {
    setImage("")
    setPrompt("")
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] p-4 gap-4 max-w-7xl mx-auto w-full">

      {/* Sidebar hidden on mobile */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          history={history}
          onSelect={(img) => setImage(img)}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 glass-panel flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="w-full max-w-3xl relative z-10">
          
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 items-center justify-center text-3xl shadow-[0_0_30px_rgba(139,92,246,0.5)] mb-6 animate-pulse-slow">
              🎨
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-4 tracking-tight">
              AI Image Studio
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">Describe the visuals you want to bring to life, and let our advanced AI render them instantly.</p>
          </div>

          {/* Input Controls */}
          <div className="glass-panel bg-dark-800/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl mb-8 relative group overflow-hidden">
            
            {/* Dynamic input border glow inside */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A vast cybernetic landscape at twilight, highly detailed, photorealistic 8k..."
              className="glass-input relative z-10 min-h-[140px] resize-none mb-6 text-lg leading-relaxed placeholder:text-gray-600 border-white/10 focus:border-primary-500/50 bg-black/40"
            />

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="btn-primary flex-1 flex items-center justify-center gap-3 py-4 text-lg font-semibold shadow-glow group border border-primary-400/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">✨</span>
                    Generate Artwork
                  </>
                )}
              </button>

              <button
                onClick={handleNew}
                className="btn-outline sm:w-32 flex items-center justify-center gap-2 py-4 border-white/10 hover:bg-white/10 hover:border-white/30 transition-all font-medium"
                disabled={loading}
              >
                <span>➕</span> Clear
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className={`transition-all duration-700 ${image ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95 hidden"}`}>
            {image && (
              <div className="p-2 rounded-3xl bg-gradient-to-b from-white/10 to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="bg-black rounded-[20px] overflow-hidden relative group aspect-square md:aspect-video flex items-center justify-center border border-white/5">
                  <img
                    src={image}
                    alt="AI generated"
                    className="w-full h-full object-cover md:object-contain transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-8">
                    <a
                      href={image}
                      download="smartai-art.png"
                      className="btn-primary flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                    >
                      <span>⬇️</span> Download High-Res
                    </a>
                  </div>

                  {/* Top glowing badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
                    <span className="text-xs font-semibold text-gray-300">Generation Complete</span>
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