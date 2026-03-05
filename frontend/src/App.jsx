import { useState, useCallback, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { GlobalStyle } from "./styling/GlobalStyles"
import { LoginForm } from "./components/login"
import { SignUpForm } from "./components/signup"
import ProtectedRoute from "./pages/start"
import { Dashboard } from "./pages/dashboard"
import { API_URL, fetchJson } from "./api"
import styled from "styled-components"

export const App = () => {
  const navigate = useNavigate()
  const [cats, setCats] = useState([])
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState("login")

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error("Login failed")

    const { response } = await res.json()
    console.log("login response:", response)

    if (response.token) {
      localStorage.setItem("token", response.token)
    } else {
      console.warn("No token returned from login", response)
    }

    localStorage.setItem("user", JSON.stringify(response))
    setUser(response)

    navigate("/dashboard")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.warn("Corrupt user data in localStorage", e)
        localStorage.removeItem("user")
      }
    }
  }, [])


  const handleSignUpSuccess = (newUser) => {
    if (newUser.token) {
      localStorage.setItem("token", newUser.token)
    }
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    navigate("/dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  const toggleAuthMode = () =>
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"))

  const loadCats = async () => {
    try {
      const data = await fetchJson(`${API_URL}/cats`, {
      })
      setCats(data)
    } catch (e) {
      console.error("Failed to load cats:", e)
    }
  }

  useEffect(() => {
    loadCats()
  }, [])

  // Cats
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

  const onEdit = async (catId, cat) => {
    try {
      const token = localStorage.getItem("token")
      await fetchJson(`${API_URL}/cats/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cat),
      })
      loadCats()
    } catch (e) { console.log(e) }
  }


  const deleteCat = async (id) => {
    try {
      await fetchJson(`${API_URL}/cats/${id}`, { method: "DELETE" })
      setCats((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      console.error("Delete cat error:", err)
    }
  }

  // Comments
  const createComment = async (catId, newText) => {
    try {
      const token = localStorage.getItem("token")
      await fetchJson(`${API_URL}/cats/${catId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText.trim() }),
      })
      loadCats()
    } catch (e) {
      console.error(e)
      setError(e.message || "Could not post comment")
    }
  }


  const deleteComment = async (catId, commentId) => {
    try {
      await fetchJson(`${API_URL}/cats/${catId}/comments/${commentId}`, { method: "DELETE" })
      loadCats()
    } catch (err) {
      console.error("Delete comment error:", err)
    }
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
                onEdit={onEdit}
                logout={handleLogout}
                user={user}
                onCreateComment={createComment}
                onDelete={deleteCat}
                onDeleteComment={deleteComment}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

// Styling
const ToggleWrapper = styled.div`
  margin-top: 12px;
  text-align: center;
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #000000;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    text-decoration: underline;
  }
`

export default App