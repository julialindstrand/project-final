import React, { useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"

export const LoginForm = ({ login }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setErrorMsg("Please fill in both fields")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      await login(formData.email, formData.password)

      navigate("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StyledBody>
      <Wrapper role="main">
        <FormWrapper onSubmit={handleSubmit}>
          <h2>Log in</h2>

          {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

          <StyledDiv>
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
            {isSubmitting ? "Logging in…" : "Log In"}
          </StyledBtn>
        </FormWrapper>
      </Wrapper>
    </StyledBody>
  );
};

export default LoginForm

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Wrapper = styled.main`
  width: 320px;
  padding: 10px;
  border: 1px solid #265237;
  border-radius: 24px;
  box-shadow: 0 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  margin-bottom: 50px;
  background-color: #2b5c3f;
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
  margin: 5px 0;
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
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`

const ErrorMsg = styled.p`
  color: #c00;
  margin-bottom: 12px;
`