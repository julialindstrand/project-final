import { useState } from "react"
import styled from "styled-components"

// import { theme } from "../styling/Theme"  
// 

export const LoginForm = ({ login }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields")
      return
    }
    try {
      await login(formData.email, formData.password)
      setFormData({ name: "", email: "", password: "" })
    } catch {
      setError("Invalid email or password")
    }
  }



  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  return (
    <Wrapper>
      <FormWrapper className="login-form" onSubmit={handleSubmit}>
        <h2>Log in</h2>

        <StyledDiv className="login-inputs">
          <Styledlabel>
            Email
            <StyledInput
              onChange={handleChange}
              type="email"
              name="email"
              value={formData.email}
            />
          </Styledlabel>
          <Styledlabel>
            Password
            <StyledInput
              onChange={handleChange}
              type="password"
              name="password"
              value={formData.password}
            />
          </Styledlabel>
        </StyledDiv>

        {error && <p style={{ color: "black" }}>{error}</p>}

        <StyledBtn type="submit">Log In</StyledBtn>
      </FormWrapper>
    </Wrapper>
  )
}

export default LoginForm

const Wrapper = styled.div`
  padding: 10px;
  border: 1px solid #265237;
  border-radius: 24px;
  box-shadow: 0 0 0.25rem 0.5rem rgba(0, 0, 0, .15);
  margin-bottom: 50px;
  background-color: #2B5C3F;
`

const FormWrapper = styled.form`
  background: #47785A;
  border: 1px solid #417354;
  border-radius: 16px;
  padding: 20px;
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
`

const Styledlabel = styled.label`
  display: flex;
  flex-direction: column;
`

const StyledInput = styled.input`
  /* background-color: #d4f9e4; */
`

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 4px;

    &:hover {
    border: 2px solid #142d1e;
    cursor: pointer;
  }
`