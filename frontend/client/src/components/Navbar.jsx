import { Link, useLocation } from "react-router-dom"
import { useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AuthContext from "../context/AuthContext"

function Navbar() {
  const token = localStorage.getItem("token")
  const location = useLocation()
  const { credits } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const navLinks = [
    { path: "/", name: "Dashboard", icon: "🏠" },
    { path: "/chat", name: "AI Chat", icon: "💬" },
    { path: "/image", name: "Image AI", icon: "🎨" },
    { path: "/resume", name: "Resume AI", icon: "📄" },
    { path: "/notes", name: "Notes AI", icon: "📝" },
  ]

  const linkStyle = (path) => {
    const isActive = location.pathname === path
    return `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-white/20 text-white font-semibold" 
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              SmartAI Hub
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkStyle(link.path)}
              >
                <span className="text-sm">{link.icon}</span>
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}

            {/* Credits Display */}
            {token && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-4 px-3 py-1.5 bg-white/20 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">💰</span>
                <span className="text-sm font-semibold">{credits || 20}</span>
                <span className="text-xs text-white/70">credits</span>
                {credits <= 5 && (
                  <span className="text-xs bg-red-500/50 px-1.5 py-0.5 rounded-full text-white">
                    Low!
                  </span>
                )}
              </motion.div>
            )}

            {/* Auth Button */}
            {!token ? (
              <Link
                to="/login"
                className="ml-4 px-4 py-1.5 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm"
              >
                Login
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium text-sm"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-white/20">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      location.pathname === link.path
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-sm">{link.name}</span>
                  </Link>
                ))}

                {/* Mobile Credits */}
                {token && (
                  <div className="px-4 py-2 mt-2 bg-white/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="font-semibold">{credits || 20}</span>
                      <span className="text-xs">credits</span>
                    </div>
                    {credits <= 5 && (
                      <span className="text-xs bg-red-500/50 px-2 py-0.5 rounded-full text-white">
                        Low Credits!
                      </span>
                    )}
                  </div>
                )}

                {/* Mobile Auth Button */}
                {!token ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 bg-white text-purple-600 rounded-lg font-medium text-center"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-center"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar