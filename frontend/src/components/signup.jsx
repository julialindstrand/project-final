import React, { useState } from "react"
import styled from "styled-components"
import { API_URL } from "../App"
import { useNavigate } from "react-router-dom"

export const SignUpForm = ({ onSuccess, setUser }) => {
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
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const msg = errBody.message || `Status ${response.status}`
        throw new Error(msg)
      }

      const payload = await response.json()
      const user = payload.response || payload

      if (user.accessToken) {
        localStorage.setItem("token", user.accessToken)
      }
      localStorage.setItem("user", JSON.stringify(user))

      if (typeof setUser === "function") setUser(user)
      if (typeof onSuccess === "function") onSuccess(user)
      navigate("/dashboard")
    } catch (error) {
      console.error("Sign‑up error:", error);
      setErrorMsg(error.message || "Could not create account")
    } finally {
      setIsSubmitting(false)
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