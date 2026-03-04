import React, { useState } from "react"
import styled from "styled-components"
import { API_URL } from "../api"
import { useNavigate } from "react-router-dom"

export const SignUpForm = ({ setUser }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Name, email and password are required")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const res = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Status ${res.status}`)
      }

      const payload = await res.json()
      const user = payload.response || payload

      // Store token & user
      if (user.token) localStorage.setItem("token", user.token)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user);
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message)
    }
  }

  return (
    <FormWrapper className="signup-form" onSubmit={handleSignUp}>
      <h2>Sign up</h2>

      {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

      <StyledDiv className="login-inputs">
        <StyledLabel>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </StyledLabel>

        <StyledLabel>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </StyledLabel>

        <StyledLabel>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </StyledLabel>
      </StyledDiv>

      <StyledBtn type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Sign up"}
      </StyledBtn>
    </FormWrapper>
  )
}

export default SignUpForm

const FormWrapper = styled.form`
  background: #f2f0f0;
  border: 1px solid black;
  box-shadow: 10px 10px 0 black;
  padding: 20px;
  margin-bottom: 50px;
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`

const StyledBtn = styled.button`
  background-color: white;
  border: 2px solid #c9c8c8;
  padding: 4px;
  &:hover {
    border: 2px solid black;
    cursor: pointer;
  }
`

const ErrorMsg = styled.p`
  color: #c00;
  margin-bottom: 12px;
`