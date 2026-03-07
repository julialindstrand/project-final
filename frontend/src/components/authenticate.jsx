import React, { createContext, useState, useEffect } from "react"
import * as jwtDecode from "jwt-decode"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const syncUserFromToken = (token) => {
    try {
      const decoded = jwtDecode.default(token);
      setUser({ id: decoded.sub, role: decoded.role, name: decoded.name })
    } catch (_) {
      setUser(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) syncUserFromToken(token)
  }, [])

  const login = (token) => {
    localStorage.setItem("token", token)
    syncUserFromToken(token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}