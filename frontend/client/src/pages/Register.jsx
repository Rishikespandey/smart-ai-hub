import { useState } from "react"
import { registerUser } from "../services/api"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields required")
      return
    }

    setLoading(true)
    
    try {
      const res = await registerUser({ name, email, password })

      if (res && res.success) {
        alert("Registered successfully")
        navigate("/login")
      } else {
        alert(res.error || "Register failed")
      }
    } catch (err) {
      alert("Something went wrong")
    }
    
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-panel p-8 w-full max-w-md relative z-10 border-white/20 animate-slide-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 items-center justify-center text-3xl shadow-glow mb-4">
            ✨
          </div>
          <h2 className="text-3xl font-display font-bold mb-2 text-white">Join SmartAI</h2>
          <p className="text-gray-400">Create an account to start generating</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="glass-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleRegister();
              }}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </div>
            ) : "Create Account"}
          </button>
        </div>
        
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">Log in here</Link>
        </p>

      </div>
    </div>
  )
}