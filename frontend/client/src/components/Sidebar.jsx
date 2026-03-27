import { Link, useLocation } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"

function Sidebar({ history = [], onSelect }) {
  const location = useLocation()
  const { user } = useContext(AuthContext)

  const navItem = (path, label) => (
    <Link
      to={path}
      className={`p-3 rounded-xl transition-all flex items-center gap-3 font-medium
      ${
        location.pathname === path
          ? "bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="w-64 glass-panel border-y-0 text-white min-h-screen flex flex-col rounded-none relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-full h-32 bg-primary-500/10 blur-[50px] pointer-events-none"></div>

      {/* 🔷 TOP SECTION */}
      <div className="p-6 border-b border-white/10 relative z-10 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
          🚀 SmartAI
        </h2>
        {user && (
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow text-sm uppercase">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 🔷 NAVIGATION */}
      <div className="p-4 space-y-2 relative z-10 flex-1">
        {navItem("/", "🏠 Dashboard")}
        {navItem("/chat", "🤖 AI Chat")}
        {navItem("/image", "🎨 Image Generator")}
        {navItem("/resume", "📄 Resume Analyzer")}
        {navItem("/notes", "📝 Notes Summarizer")}
      </div>

      {/* 🔷 HISTORY SECTION */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-white/5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>🖼</span> Image History
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4 bg-black/20 rounded-lg border border-white/5">
            No images yet
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {history.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`history v${i}`}
                onClick={() => onSelect && onSelect(img)}
                className="rounded-lg object-cover aspect-square cursor-pointer hover:scale-105 hover:shadow-glow transition-all ring-1 ring-white/10"
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Sidebar