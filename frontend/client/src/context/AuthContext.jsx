import { createContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [credits, setCredits] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log("🔥 AUTH API:", res.data)

        if (res.data.success) {
          setCredits(res.data.credits)
          setUser(res.data.user)
        }

      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [])

  return (
    <AuthContext.Provider value={{ credits, setCredits, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext