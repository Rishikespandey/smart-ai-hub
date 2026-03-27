import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: "Credits Available", value: 20, icon: "⚡" },
    { title: "AI Conversations", value: 12, icon: "💬" },
    { title: "Notes Summarized", value: 5, icon: "📝" },
    { title: "Resumes Analyzed", value: 3, icon: "📄" },
  ];

  const features = [
    { name: "AI Chat", path: "/chat", desc: "Interact with advanced AI", icon: "🤖" },
    { name: "Image Generator", path: "/image", desc: "Create stunning visuals", icon: "🎨" },
    { name: "Resume Analyzer", path: "/resume", desc: "Optimize your CV", icon: "🎯" },
    { name: "Notes Summarizer", path: "/notes", desc: "Condense long texts", icon: "📚" },
  ];

  return (
    <div className="pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full text-white space-y-16 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center md:text-left relative z-10"
      >
        <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium text-sm mb-6 backdrop-blur-md shadow-glow">
          <span className="text-primary-400">✨ Welcome back,</span> {user?.name || "Creator"}
        </span>
        <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-tight">
          Your Creative <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">AI Command Center</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed">
          Monitor your usage, access powerful tools, and track your recent generations all in one beautiful dashboard.
        </p>
      </motion.div>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="glass-panel p-6 relative overflow-hidden group hover:-translate-y-2 hover:shadow-glow transition-all duration-300 border border-white/5 hover:border-primary-500/30"
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-gray-400 font-medium text-sm uppercase tracking-wider">{item.title}</h2>
              <span className="text-2xl opacity-80 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{item.icon}</span>
            </div>
            <p className="text-4xl md:text-5xl font-display font-bold text-white relative z-10">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ⚡ Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-xl">
            ⚡
          </div>
          <h2 className="text-2xl font-display font-semibold text-white">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, index) => (
            <Link
              key={index}
              to={f.path}
              className="group glass-panel p-8 flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 border-white/5 hover:border-white/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:bg-primary-500/20 group-hover:text-primary-400 group-hover:scale-110 group-hover:rotate-6 transition-all border border-white/10 group-hover:border-primary-500/30 shadow-lg">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white group-hover:text-primary-300 transition-colors">{f.name}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 🕒 Recent Activity */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-panel p-6 md:p-8 relative z-10 border-white/5"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-xl">
              🕒
            </div>
            <h2 className="text-xl font-display font-semibold text-white">
              Recent Activity
            </h2>
          </div>
          <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/10 px-4 py-2 rounded-full border border-primary-500/20">
            View All
          </button>
        </div>

        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center text-2xl shrink-0 shadow-glow">
              🧠
            </div>
            <div className="flex-1 mt-1">
              <p className="font-semibold text-white">New chat created</p>
              <p className="text-sm text-gray-400 mt-1">Discussed React architecture with AI.</p>
            </div>
            <span className="text-xs font-medium text-gray-500 mt-1">2h ago</span>
          </div>
          
          <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              📄
            </div>
            <div className="flex-1 mt-1">
              <p className="font-semibold text-white">Resume analyzed</p>
              <p className="text-sm text-gray-400 mt-1">Score improved by 15% with suggested edits.</p>
            </div>
            <span className="text-xs font-medium text-gray-500 mt-1">Yesterday</span>
          </div>

          <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              📝
            </div>
            <div className="flex-1 mt-1">
              <p className="font-semibold text-white">Meeting notes summarized</p>
              <p className="text-sm text-gray-400 mt-1">Project sync Q3 planning.</p>
            </div>
            <span className="text-xs font-medium text-gray-500 mt-1">2 days ago</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}