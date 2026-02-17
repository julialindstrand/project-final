import { useState } from "react"
import styled from "styled-components"

const API_URL = 'http://localhost:8080'

export const CatCardForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    picture: null,   // will hold a File object
    name: "",
    gender: "",
    location: "",
  })

  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "picture" && files && files[0]) {
      const file = files[0]
      setFormData((prev) => ({ ...prev, picture: file }))
      // optional preview
      setPreviewUrl(URL.createObjectURL(file))
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
      payload.append("name", formData.name)
      payload.append("gender", formData.gender)
      payload.append("location", formData.location)

      const response = await fetch(`${API_URL}/cats`, {
        method: "POST",
        body: payload, // multipart/form‑data is handled automatically
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
    } catch (error) {
      console.error("Submit error:", error)
      setErrorMsg("Could not save cat information")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormWrapper>
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      {/* Picture */}
      <div>
        <label htmlFor="picture">Picture</label>
         
        <input
          type="file"
          id="picture"
          name="picture"
          accept="image/*"
          onChange={handleChange}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Cat preview"
            style={{ width: "100%", marginTop: 8, borderRadius: 4 }}
          />
        )}
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
          placeholder="Enter cat’s name"
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
          {/* Replace these with your actual locations */}
          <option value="home">Home</option>
          <option value="shelter">Shelter</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {/* Submit / Feedback */}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Add Cat"}
      </button>
    </form>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: black solid 2px;
    border-radius: 15px;
`