import { API_URL } from "../api/api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { AuthContext } from "../components/authenticate"

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (!user) return
    if (!API_URL) {
      setError("API URL not configured")
      return
    }
    const token = localStorage.getItem("token")
    fetch(`${API_URL}/admin`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then((data) => setStats(data.data))
      .catch((err) => setError(err.message))
  }, [user, API_URL])

  if (!user) return <p>Loading…</p>
  if (user.role !== "admin") return <p>Access denied, admin only.</p>
  if (error && !submitMessage) return <p>Error: {error}</p>
  if (!stats) return <p>Loading admin stats…</p>

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage("")
    setError("")

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create user")
      }

      setSubmitMessage("User created successfully!")
      setFormData({ name: "", email: "", role: "user", password: "" })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PanelWrapper>
      <StyledBtn onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </StyledBtn>

      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.name}</p>

      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Create New User</h3>

        {submitMessage && <p style={{ color: "green" }}>{submitMessage}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <StyledBtn
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create User"}
          </StyledBtn>
        </form>
      </div>
    </PanelWrapper>
  )
}

const PanelWrapper = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
`

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
}

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 8px;
    cursor: pointer;
  }
`