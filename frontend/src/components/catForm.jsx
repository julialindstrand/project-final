import { useState } from "react"
import styled from "styled-components"
import { API_URL } from "../api"
import placeholder2 from "../assets/placeholder2.png"

export const CatForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    picture: null,
    name: "",
    gender: "",
    location: "",
  })

  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(placeholder2)

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "picture") {
      if (files && files[0]) {
        const file = files[0]
        setFormData((prev) => ({ ...prev, picture: file }))
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        setFormData((prev) => ({ ...prev, picture: null }))
        setPreviewUrl(placeholder2)
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.picture || !formData.name || !formData.gender || !formData.location) {
      setErrorMsg("All fields are required")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const payload = new FormData()
      payload.append("picture", formData.picture)
      payload.append("filename", formData.name)
      payload.append("gender", formData.gender)
      payload.append("location", formData.location)

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/cats`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: payload,
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const msg = errBody.message || `Status ${response.status}`
        throw new Error(msg)
      }

      const newCat = await response.json()
      if (typeof onSuccess === "function") {
        onSuccess(newCat)
      }

      setFormData({
        picture: null,
        name: "",
        gender: "",
        location: "",
      })
      setPreviewUrl(placeholder2)

    } catch (error) {
      console.error("Submit error:", error)
      setErrorMsg("Could not save cat information")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Wrapper>
      <FormWrapper onSubmit={handleSubmit}>
        <div>
          <label for="picture" htmlFor="picture"></label>
          <ImageBox>
            {previewUrl && (
              <PreviewImg
                src={previewUrl}
                alt="Cat preview"
              />
            )}
          </ImageBox>
          <div>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleChange}
              aria-label="picture"
            />
          </div>
        </div>

        {/* Name */}
        <StyledRow>
          <label htmlFor="name">Name</label>
          <StyledName
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-label="name"
          />
        </StyledRow>

        {/* Gender */}
        <StyledRow>
          <label htmlFor="gender">Gender</label>
          <StyledSelect
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            aria-label="gender"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </StyledSelect>
        </StyledRow>

        {/* Location */}
        <StyledRow>
          <label htmlFor="location">Location</label>

          <StyledSelect
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            aria-label="location"
          >
            <option value="">Select location</option>
            <option value="adopted">Adopted</option>
            <option value="animalshelter">Animal Shelter</option>
            <option value="fosterhome">Foster Home</option>
            <option value="outdoor">Outdoor</option>
          </StyledSelect>
        </StyledRow>

        {/* Submit / Feedback */}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <StyledBtn type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Add Cat"}
        </StyledBtn>
      </FormWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  padding: 10px;
  border: 1px solid #265237;
  border-radius: 24px;
  /* box-shadow: 0 0 0.25rem 0.5rem rgba(0, 0, 0, .15); */
  margin-bottom: 50px;
  background-color: #2B5C3F;
  max-width: 345px;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);
`

const FormWrapper = styled.form`
  background: #d4ded7;
  border: 1px solid #417354;
  border-radius: 16px;
  padding: 20px;
  `

const StyledName = styled.input`
  width: 68.5%;
`

const StyledSelect = styled.select`
  width: 70%;
  text-align: center;
`

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 3px 0px;
`

const ImageBox = styled.div`
  max-width: 300px;
  max-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 15px;
  `

const PreviewImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: "100%";
  border-radius: 4;
  `

const StyledBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 4px;
  display: block;
  margin-left: auto;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);  padding: 4px;
    cursor: pointer;
  }
`