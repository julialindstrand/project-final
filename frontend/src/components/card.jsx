import React, { useState } from "react"
import styled from "styled-components"
import { API_URL, fetchJson } from "../api"

export const CatCard = ({ cat, currentUser, onEdit, onCreateComment, onDelete, onDeleteComment }) => {
  const catId = cat._id
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [newText, setNewText] = useState("")
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(cat)

  // Show comments
  const toggleExpand = () => {
    setExpanded((prev) => !prev)
  }

  // New comment
  const handleCreateComment = async (e) => {
    e.preventDefault()
    if (!newText.trim()) return
    if (typeof onCreateComment === "function") onCreateComment(catId, newText.trim())
    setNewText("")
  }

  // Delete comment
  const handleDeleteComment = (catId, commentId) => {
    if (typeof onDelete === "function") onDeleteComment(catId, commentId)
  }

  // Delete cat
  const handleDelete = () => {
    if (window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) {
      if (typeof onDelete === "function") onDelete(catId)
    }
  }

  // Edit
  const handleSave = async () => {
    await onEdit(catId, formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value.trim() })
  }

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.value })
  }

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value })
  }

  return (
    <CardWrapper>
      {isEditing ? (

        <>
          <ImgWrapper>
            <CatImg src={cat.imageUrl} alt={cat.name} />
          </ImgWrapper>
          <Info>
            <Name htmlFor="name">Name</Name>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
            />
          </Info>
          {/* Gender */}
          <Info>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleGenderChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Info>
          {/* Location */}
          <Info>
            <label htmlFor="location">Location</label>

            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
            >
              <option value="adopted">Adopted</option>
              <option value="animalshelter">Animal Shelter</option>
              <option value="fosterhome">Foster Home</option>
              <option value="outdoor">Outdoor</option>

            </select>
          </Info>

          <EditMode>
            <OtherBtn onClick={handleSave}>💾</OtherBtn>
            <OtherBtn onClick={handleCancel}>✖️</OtherBtn>
          </EditMode>
        </>

      ) : (

        <>
          <ImgWrapper>
            <CatImg src={cat.imageUrl} alt={cat.name} />
          </ImgWrapper>

          <Info>
            <Name>{cat.name}</Name>
            <EditDelete>
              <OtherBtn onClick={() => setIsEditing(true)}>✏️</OtherBtn>
              <OtherBtn onClick={handleDelete}>
                🗑️
              </OtherBtn>
            </EditDelete>
          </Info>

          <Meta>
            <Tag>{cat.gender}</Tag>
            <Tag>{cat.location}</Tag>
          </Meta>

          {/* Expand / collapse button */}
          <ToggleBtn onClick={toggleExpand}>
            {expanded ? "▲ Hide comments" : "▼ Show comments"}
          </ToggleBtn>
          {expanded && (
            <ExpandedSection>
              {loading && <p>Loading comments…</p>}
              {error && <ErrorMsg>{error}</ErrorMsg>}

              <CommentList>
                {(cat.comments ?? []).map((c) => (
                  <CommentItem key={c._id}>
                    <CommentInfo>
                      <div>
                        <Author>{c.userName}</Author>
                        <Timestamp>{new Date(c.createdAt).toLocaleString()}</Timestamp>
                      </div>
                      <OtherBtn onClick={() => handleDeleteComment(catId, c._id)}>
                        🗑️
                      </OtherBtn>
                    </CommentInfo>
                    <Text>{c.text}</Text>
                  </CommentItem>
                ))}
              </CommentList>

              {currentUser && (
                <form onSubmit={handleCreateComment}>
                  <CommentInput
                    placeholder="Write a comment…"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                  />
                  <CommentBtn type="submit">Post</CommentBtn>
                </form>
              )}
            </ExpandedSection>
          )
          }
        </>
      )}
    </CardWrapper >
  )
}

const CardWrapper = styled.article`
  max-width: 365px;
  min-width: 345px;
  border: 2px solid #3f895c;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background: #F5F5F5;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);
  
  &:hover {
    transform: scale(1.01);
  }
`

const ImgWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  `

const CatImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  `

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 16px;
  `

const EditDelete = styled.div`
  display: flex;
  flex-direction: row;
`

const Name = styled.h3`
  margin: 0 0 8px;
  font-size: 1.1rem;
  `

const Meta = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px 15px;
  gap: 5px;
  `

const EditMode = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
  `

const OtherBtn = styled.button`
  background: #FFFFFF;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 6px;
  
  &:hover {
    transform: scale(1.15);
  }
`

const Tag = styled.span`
  background: #d4ded7;
  /* color: #000000; */
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  `

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #000000;
  padding: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  
  &:hover {
  text-decoration: underline;
  }
  `

const ExpandedSection = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #eee;
  `

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
  `

const CommentItem = styled.li`
  margin-bottom: 10px;
  background: #f5f5f5;
  padding: 6px 8px;
  width: 90%;
  `

const CommentInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Author = styled.span`
  color: #3f895c;
  font-weight: bold;
  margin-right: 6px;
  `

const Timestamp = styled.span`
  color: #666;
  font-size: 0.8rem;
  `

const Text = styled.p`
  margin: 4px 0 0;
 `

const CommentInput = styled.textarea`
  width: 92%;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 6px;
  padding: 6px;
  `

const CommentBtn = styled.button`
  background-color: #b0cebd;
  border: 2px solid #3f895c;
  border-radius: 8px;
  padding: 6px 12px;
  
  &:hover {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);    padding: 6px 12px;
    cursor: pointer;
  }
`

const ErrorMsg = styled.p`
  color: #c00;
  `