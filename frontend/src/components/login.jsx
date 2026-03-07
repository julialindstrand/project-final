// src/components/LoginForm.jsx
import { useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/authenticate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login: storeToken } = useContext(AuthContext); // rename to avoid confusion
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- basic client‑side validation ----
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      // ---- 1️⃣ POST to the back‑end ----
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // ---- 2️⃣ handle non‑200 responses ----
      if (!response.ok) {
        // Try to read the JSON error payload; fall back to status text
        const errPayload = await response.json().catch(() => ({}));
        const msg = errPayload.message || `Status ${response.status}`;
        throw new Error(msg);
      }

      // ---- 3️⃣ extract the JWT ----
      const payload = await response.json(); // { response: { token, … } }
      const token = payload.response?.token;
      if (!token) throw new Error("Server did not return a token");

      // ---- 4️⃣ store token in context ----
      storeToken(token); // updates AuthContext & localStorage

      // ---- 5️⃣ navigate to the protected page ----
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <StyledBody>
      <Wrapper role="main">
        <FormWrapper onSubmit={handleSubmit}>
          <h2>Log in</h2>

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

          {error && <p style={{ color: "#c00" }}>{error}</p>}

          <StyledBtn type="submit">Log In</StyledBtn>
        </FormWrapper>
      </Wrapper>
    </StyledBody>
  );
};

export default LoginForm;

/* -------------------------------------------------
   Styled components (unchanged – they render <div>/<main>)
------------------------------------------------- */
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.main`
  width: 320px;
  padding: 10px;
  border: 1px solid #265237;
  border-radius: 24px;
  box-shadow: 0 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  margin-bottom: 50px;
  background-color: #2b5c3f;
`;

const FormWrapper = styled.form`
  background: #d4ded7;
  border: 1px solid #417354;
  border-radius: 16px;
  padding: 20px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
`;

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 4px;

  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;