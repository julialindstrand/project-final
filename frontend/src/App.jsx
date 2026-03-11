import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { GlobalStyle } from "./styling/GlobalStyles"
import { LoginForm } from "./components/login"
import { SignUpForm } from "./components/signup"
import ProtectedRoute from "./pages/start"
import { Dashboard } from "./pages/dashboard"
import AdminPanel from "./pages/adminpanel"

import { AuthContext } from "./components/authenticate"
import { useCats } from "./handling/useCats"
import { useComments } from "./handling/useComments"

import styled from "styled-components"

export const App = () => {
  const { user, login, logout } = useContext(AuthContext)

  // Cats
  const {
    cats,
    loadCats,
    addCat,
    editCat,
    deleteCat,
  } = useCats()

  // Comments
  const { createComment, deleteComment } = useComments()

  React.useEffect(() => {
    loadCats()
  }, [loadCats])

  const handleLogin = async (email, password) => {
    await login(email, password)
  }

  const handleSignUpSuccess = async (newUser) => {
    await signup(newUser.name, newUser.email, newUser.password)
  }

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginForm login={handleLogin} />
          }
        />

        <Route
          path="/signup"
          element={<SignUpForm onSuccess={handleSignUpSuccess} />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                cats={cats}
                onNewCat={addCat}
                loadCats={loadCats}
                onEdit={editCat}
                onDelete={deleteCat}
                logout={logout}
                user={user}
                onCreateComment={createComment}
                onDeleteComment={deleteComment}
              />
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App

const ToggleWrapper = styled.div`
  margin-top: 12px;
  text-align: center;
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    text-decoration: underline;
  }
`