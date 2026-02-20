import { useState } from "react"
import styled from "styled-components"
import { API_URL } from "../App"
import placeholderImg from "../assets/placeholderImg.jpg"

export const CatForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    picture: null,
    name: "",
    gender: "",
    location: "",
  })

  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(placeholderImg)

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "picture") {
      if (files && files[0]) {
        const file = files[0]
        setFormData((prev) => ({ ...prev, picture: file }))
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        setFormData((prev) => ({ ...prev, picture: null }))
        setPreviewUrl(placeholderImg)
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

      const response = await fetch(`${API_URL}/cats`, {
        method: "POST",
        body: payload,
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const msg = errBody.message || `Status ${response.status}`
        throw new Error(msg)
      }

      const newCat = await response.json();
      if (typeof onSuccess === "function") {
        onSuccess(newCat)
      }

    } catch (error) {
      console.error("Submit error:", error)
      setErrorMsg("Could not save cat information")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <div>
          <label htmlFor="picture"></label>
          <ImageBox>
            {previewUrl && (
              <PreviewImg
                src={previewUrl}
                alt="Cat preview"
              />
            )}
          </ImageBox>
          <input
            type="file"
            id="picture"
            name="picture"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          // placeholder="Enter cats name"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location">Location</label>

          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="">Select location</option>
            <option value="fosterhome">Foster Home</option>
            <option value="animalshelter">Animal Shelter</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        {/* Submit / Feedback */}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Add Cat"}
        </button>
      </StyledForm>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: black solid 2px;
  border-radius: 15px;
`

const StyledForm = styled.form`
  max-width: 400px;
  margin: 10px;
`

const ImageBox = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const PreviewImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: "100%";
  margin-top: 8;
  border-radius: 4;
`