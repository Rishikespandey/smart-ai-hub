import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Dashboard"
import Chat from "./pages/Chat"
import ImageGen from "./pages/ImageGen"
import Resume from "./pages/Resume"
import Notes from "./pages/Notes"
import Login from "./pages/Login"
import Register from "./pages/Register"

// 🔹 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

function AppContent() {
  const location = useLocation()

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register"
  // Sirf image page pe sidebar dikhao
  const showSidebar = location.pathname === "/image"

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            style: { background: '#10b981' },
          },
          error: {
            style: { background: '#ef4444' },
          },
        }}
      />

      {!hideNavbar && <Navbar />}

      {/* Flex container - sirf image page pe sidebar ke saath */}
      <div className={showSidebar ? "flex" : ""}>
        {showSidebar && <Sidebar />}
        <div className={showSidebar ? "flex-1" : "w-full"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/image" element={<ProtectedRoute><ImageGen /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>

    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}