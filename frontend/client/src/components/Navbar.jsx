import { Link, useLocation } from "react-router-dom"
import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import { Menu, X } from "lucide-react"

function Navbar() {
  const token = localStorage.getItem("token")
  const location = useLocation()
  const { credits, user } = useContext(AuthContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const linkStyle = (path) =>
    `relative px-3 py-2 text-sm font-medium transition-colors hover:text-white ${
      location.pathname === path
        ? "text-white"
        : "text-gray-400"
    }`

  const NavLinks = () => (
    <>
      <Link to="/dashboard" className={linkStyle("/dashboard")}>
        Dashboard
        {location.pathname === "/dashboard" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
        )}
      </Link>
      <Link to="/chat" className={linkStyle("/chat")}>
        AI Chat
        {location.pathname === "/chat" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
        )}
      </Link>
      <Link to="/image" className={linkStyle("/image")}>
        Image AI
        {location.pathname === "/image" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
        )}
      </Link>
      <Link to="/resume" className={linkStyle("/resume")}>
        Resume AI
        {location.pathname === "/resume" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
        )}
      </Link>
      <Link to="/notes" className={linkStyle("/notes")}>
        Notes AI
        {location.pathname === "/notes" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
        )}
      </Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 rounded-none shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              SmartAI Hub
            </h1>
          </Link>

          {/* Desktop Nav */}
          {token && (
            <div className="hidden md:flex gap-1 items-center bg-white/5 px-2 py-1 rounded-2xl border border-white/5">
              <NavLinks />
            </div>
          )}

          {/* Right Area (Credits + Auth) */}
          <div className="hidden md:flex items-center gap-4">
            {token && (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full border border-primary-500/30">
                    ⚡ {credits} Credits
                  </span>
                  {credits <= 5 && (
                    <span className="text-red-400 text-xs mt-1 absolute top-12">
                      Low Balance!
                    </span>
                  )}
                </div>

                {/* User Profile Initial */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow border border-white/20 text-lg uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </>
            )}

            {!token ? (
              <Link to="/login" className="btn-primary py-2 px-5 text-sm">
                Login / Register
              </Link>
            ) : (
              <button onClick={handleLogout} className="btn-outline py-2 px-4 text-sm ml-2">
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 rounded-none animate-slide-up origin-top py-4 px-4 space-y-4 shadow-2xl">
          {token && (
            <div className="flex flex-col space-y-2">
              <NavLinks />
            </div>
          )}
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
            {token && (
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-gray-300 text-sm">Credits Remaining</span>
                <span className="font-semibold text-primary-400">⚡ {credits}</span>
              </div>
            )}
            
            {!token ? (
              <Link to="/login" className="btn-primary w-full text-center">
                Login / Register
              </Link>
            ) : (
              <button onClick={handleLogout} className="btn-outline w-full content-center">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar