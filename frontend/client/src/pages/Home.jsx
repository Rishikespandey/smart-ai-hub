import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Home() {
  const token = localStorage.getItem("token")

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      {/* 🔹 HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        {/* Background Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary-500/20 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-accent-500/20 blur-[150px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">Welcome to SmartAI Hub 2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="z-10 text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-6 leading-tight max-w-4xl"
        >
          Your All-In-One <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">AI Super Interface</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="z-10 text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
        >
          Generate stunning images, analyze complex resumes, summarize long notes, and converse with advanced language models—all from a single, beautifully designed dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {token ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto text-center transform hover:scale-105 transition-transform duration-300">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto text-center transform hover:scale-105 transition-transform duration-300">
                Get Started for Free
              </Link>
              <Link to="/login" className="glass-panel text-white hover:text-primary-300 hover:bg-white/10 text-lg px-8 py-4 w-full sm:w-auto text-center font-medium transition-all duration-300 rounded-xl">
                Login to Account
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* 🔹 FEATURES GRID */}
      <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 w-full border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to supercharge your productivity and creativity in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "💬", title: "AI Chat Assistant", desc: "Interact with advanced LLMs for coding, writing, and brainstorming in real-time." },
            { icon: "🎨", title: "Image Generator", desc: "Create high-quality, stunning visuals from simple text prompts instantly." },
            { icon: "📄", title: "Resume Analyzer", desc: "Upload your PDF and let our AI review it for ATS optimization and structure." },
            { icon: "📚", title: "Notes Summarizer", desc: "Instantly condense long articles, emails, or meeting notes into actionable bullet points." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/10 group-hover:bg-primary-500/20 group-hover:border-primary-500/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 HOW TO USE SECTION */}
      <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 w-full border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to unlock the full potential of AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

          {[
            { step: "1", title: "Create an Account", desc: "Sign up in seconds to get your initial balance of free AI generation credits." },
            { step: "2", title: "Choose a Tool", desc: "Select from our suite of models—Images, Resumes, Chat, or Summarization." },
            { step: "3", title: "Generate & Download", desc: "Provide your prompt or document and watch the AI instantly deliver the results." }
          ].map((item, i) => (
            <div key={i} className="relative z-10 p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-dark-900 border-2 border-primary-500 flex items-center justify-center text-xl font-bold text-primary-400 shadow-[0_0_20px_rgba(139,92,246,0.5)] mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {!token && (
          <div className="mt-16 flex justify-center pb-8">
            <Link to="/register" className="btn-primary text-lg px-8 py-3 transform hover:scale-105 transition-transform duration-300">
              Create Your Free Account
            </Link>
          </div>
        )}
      </section>

      {/* 🔹 FOOTER */}
      <footer className="w-full border-t border-white/10 bg-dark-800/50 backdrop-blur-md py-12 px-6 z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h2 className="text-xl font-display font-bold text-white">SmartAI Hub</h2>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Empowering creators and professionals with next-generation artificial intelligence tools.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Platform Tools</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/chat" className="hover:text-primary-400 transition-colors">AI Chat Assistant</Link></li>
              <li><Link to="/image" className="hover:text-primary-400 transition-colors">Image Generator</Link></li>
              <li><Link to="/resume" className="hover:text-primary-400 transition-colors">Resume Analyzer</Link></li>
              <li><Link to="/notes" className="hover:text-primary-400 transition-colors">Notes Summarizer</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartAI Hub. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
