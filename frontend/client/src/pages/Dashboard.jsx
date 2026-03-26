import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Dashboard() {
  const { credits: globalCredits } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    credits: globalCredits || 20,
    totalChats: 24,
    totalNotes: 12,
    totalResumes: 8,
  });

  const [userName, setUserName] = useState("User");

  // Owner Info
  const ownerName = "Rishikesh Pandey";
  const ownerTitle = "Full Stack Developer & AI Enthusiast";

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name || data.user?.name || "User");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    
    fetchUserName();
  }, []);

  useEffect(() => {
    if (globalCredits !== undefined) {
      setStats(prev => ({ ...prev, credits: globalCredits }));
    }
  }, [globalCredits]);

  const activities = [
    { id: 1, text: "💬 AI Chat: How to improve React performance", time: "Just now", credits: 1 },
    { id: 2, text: "📄 Resume: Frontend Developer resume analyzed", time: "2 hours ago", credits: 2 },
    { id: 3, text: "📝 Notes: Meeting notes summarized", time: "Yesterday", credits: 1 },
    { id: 4, text: "💬 AI Chat: MongoDB aggregation pipeline", time: "Yesterday", credits: 1 },
    { id: 5, text: "📄 Resume: Full Stack resume reviewed", time: "2 days ago", credits: 2 },
  ];

  const statsCards = [
    { title: "Credits", value: stats.credits, gradient: "from-purple-500 to-pink-500", icon: "⚡" },
    { title: "Chats", value: stats.totalChats, gradient: "from-blue-500 to-cyan-500", icon: "💬" },
    { title: "Notes", value: stats.totalNotes, gradient: "from-green-500 to-emerald-500", icon: "📝" },
    { title: "Resumes", value: stats.totalResumes, gradient: "from-orange-500 to-red-500", icon: "📄" },
  ];

  const features = [
    { name: "AI Chat", path: "/chat", icon: "💬", color: "from-blue-500 to-cyan-500", desc: "Ask anything" },
    { name: "Image Gen", path: "/image", icon: "🎨", color: "from-purple-500 to-pink-500", desc: "Create images" },
    { name: "Resume", path: "/resume", icon: "📄", color: "from-orange-500 to-red-500", desc: "Analyze resume" },
    { name: "Notes", path: "/notes", icon: "📝", color: "from-green-500 to-emerald-500", desc: "Summarize notes" },
  ];

  const tips = [
    "Use specific prompts for better results",
    "Upload clear PDFs for resume analysis",
    "Save your favorite chats for later",
    "Earn bonus credits by sharing feedback",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="relative z-10 p-4 md:p-8">
        
        {/* 🔥 OWNER CREDIT SECTION - RISHIKESH PANDEY */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-yellow-500/30 shadow-lg">
            <p className="text-xs text-yellow-400 mb-1">✨ Welcome to My World ✨</p>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Created by {ownerName}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{ownerTitle}</p>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to SmartAI Hub! 🚀
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Your AI-powered productivity hub • Built with ❤️ by <span className="text-yellow-400 font-semibold">{ownerName}</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statsCards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-20 rounded-full blur-2xl`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  {item.title === "Credits" && item.value < 5 && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Low</span>
                  )}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{item.value}</p>
                <p className="text-gray-400 text-sm">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={f.path}
                  className={`block bg-gradient-to-br ${f.color} p-5 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 border border-white/20`}
                >
                  <span className="text-3xl md:text-4xl block mb-2">{f.icon}</span>
                  <h3 className="font-semibold text-white text-sm md:text-base">{f.name}</h3>
                  <p className="text-white/70 text-xs mt-1">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🕒</span> Recent Activity
            </h2>
            <div className="space-y-3">
              {activities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{activity.text.split(" ")[0]}</span>
                    <div>
                      <p className="text-white text-sm md:text-base">{activity.text}</p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-xs font-medium">-{activity.credits} credits</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pro Tips & Creator Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> Pro Tips
            </h2>
            <div className="space-y-3">
              {tips.map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-purple-400 mt-0.5">✨</span>
                  <span>{tip}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Credit Status */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Credits Remaining</span>
                <span className="text-white font-semibold">{stats.credits}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.credits / 50) * 100}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.credits < 10 ? "⚠️ Low credits! Consider upgrading." : "✅ You're good to go!"}
              </p>
            </div>

            {/* Creator Badge at Bottom */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                🚀 Made with ❤️ by <span className="text-yellow-400">{ownerName}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}