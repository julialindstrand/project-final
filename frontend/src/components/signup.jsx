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
    <StyledBody>
      <Wrapper role="main" >
        <FormWrapper rclassName="signup-form" onSubmit={handleSignUp}>
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
      </Wrapper>
    </StyledBody>
  )
}

export default SignUpForm

const StyledBody = styled.body`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Wrapper = styled.main`
  width: 320px;
  padding: 10px;
  border: 1px solid #265237;
  border-radius: 24px;
  box-shadow: 0 0 0.25rem 0.5rem rgba(0, 0, 0, .15);
  margin-bottom: 50px;
  background-color: #2B5C3F;
`

const FormWrapper = styled.form`
  background: #d4ded7;
  border: 1px solid #417354;
  border-radius: 16px;
  padding: 20px;
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
`

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 4px;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 4px;
    cursor: pointer;
  }
`

const ErrorMsg = styled.p`
  color: #c00;
  margin-bottom: 12px;
`