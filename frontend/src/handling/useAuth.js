import { useState, useCallback, useEffect } from "react"
import {
  fetchJson
} from "../api/api"

export const useAuth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (_) {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const storeSession = useCallback((session) => {
    const { token, ...rest } = session
    console.log("Storing user session:", rest)
    if (token) localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(rest))
    setUser(rest)
  }, [])

  // Login
  const login = useCallback(
    async (email, password) => {
      const response = await fetchJson("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      storeSession(response.response)
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    },
    [storeSession]
  )

  // Signup
  const signup = useCallback(async (name, email, password) => {
    const { response } = await fetchJson("/users/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
    storeSession(response)
  }, [storeSession])


  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return { user, login, signup, logout }
}

export default useAuth