import { useState, useCallback } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { GlobalStyle } from "./styling/GlobalStyles"
import { LoginForm } from "./components/login"
import { SignUpForm } from "./components/signup"
import ProtectedRoute from "./pages/start"
import { Dashboard } from "./pages/dashboard"
import styled from "styled-components"

export const API_URL = "http://localhost:8080"

export const App = () => {
  const navigate = useNavigate()
  const [cats, setCats] = useState([])
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState("login")

  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
    []
  )

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error("Login failed")

    const { response } = await res.json()
    localStorage.setItem("user", JSON.stringify(response))
    if (response.accessToken) localStorage.setItem("token", response.accessToken)
    if (response.id) localStorage.setItem("userId", response.id)
    setUser(response)


    navigate("/dashboard")
  }

  const handleSignUpSuccess = (newUser) => {
    localStorage.setItem("token", newUser.accessToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    navigate("/dashboard")
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    navigate("/login")
  }

  const toggleAuthMode = () =>
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"))

  const loadCats = async () => {
    try {
      const res = await fetch(`${API_URL}/cats`, {
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)

      const raw = await res.json()
      const formatted = raw.map((item) => ({
        id: item._id,
        name: item.name,
        imageUrl: item.imageUrl,
        gender: item.gender,
        location: item.location,
        userId: item.userId,
      }))
      setCats(formatted)
    } catch (e) {
      console.error("Failed to load cats:", e)
    }
  }

  const handleNewCat = (newCatFromForm) => {
    const formatted = {
      id: newCatFromForm._id,
      name: newCatFromForm.name,
      imageUrl: newCatFromForm.imageUrl,
      gender: newCatFromForm.gender,
      location: newCatFromForm.location,
      userId: newCatFromForm.userId,
    }
    setCats((prev) => [formatted, ...prev])
  }

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route
          path="/login"
          element={
            <>
              {authMode === "login" ? (
                <LoginForm login={login} />
              ) : (
                <SignUpForm
                  onSuccess={handleSignUpSuccess}
                  login={login}
                  setUser={setUser}
                />
              )}
              <ToggleWrapper>
                {authMode === "login" ? (
                  <ToggleBtn onClick={toggleAuthMode}>
                    Don’t have an account? Sign up
                  </ToggleBtn>
                ) : (
                  <ToggleBtn onClick={toggleAuthMode}>
                    Already have an account? Log in
                  </ToggleBtn>
                )}
              </ToggleWrapper>
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <SignUpForm
              onSuccess={handleSignUpSuccess}
              login={login}
            />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                cats={cats}
                setCats={setCats}
                handleNewCat={handleNewCat}
                loadCats={loadCats}
                logout={handleLogout}
                user={user}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

const ToggleWrapper = styled.div`
  margin-top: 12px;
  text-align: center;
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    text-decoration: underline;
  }
`

export default App