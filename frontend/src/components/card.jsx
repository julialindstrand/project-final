import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { API_URL, fetchJson } from "../api"

export const CatCard = ({ cat, currentUser }) => {
  const catId = cat._id
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [newText, setNewText] = useState("")
  const [error, setError] = useState("")

  const loadComments = async () => {
    setLoading(true)
    try {
      const data = await fetchJson(`${API_URL}/cats/${catId}/comments`)
      setComments(data)
    } catch (e) {
      console.error(e)
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  // Show comments
  const toggleExpand = () => {
    setExpanded((prev) => !prev)
    if (!expanded && comments.length === 0) {
      loadComments()
    }
  }

  // New comment
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newText.trim()) return

    try {
      const created = await fetchJson(`${API_URL}/cats/${catId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: newText.trim() }),
      })
      setComments((prev) => [created, ...prev])
      setNewText("")
    } catch (e) {
      console.error(e)
      setError(e.message || "Could not post comment")
    }
  }

  return (
    <CardWrapper>
      <ImgWrapper>
        <CatImg src={cat.imageUrl} alt={cat.name} />
      </ImgWrapper>

      <Info>
        <Name>{cat.name}</Name>
        <Meta>
          <Tag>{cat.gender}</Tag>
          <Tag>{cat.location}</Tag>
        </Meta>
      </Info>

      {/* Expand / collapse button */}
      <ToggleBtn onClick={toggleExpand}>
        {expanded ? "▲ Hide comments" : "▼ Show comments"}
      </ToggleBtn>
      {expanded && (
        <ExpandedSection>
          {loading && <p>Loading comments…</p>}
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <CommentList>
            {comments.map((c) => (
              <CommentItem key={c._id}>
                <Author>{c.userName}</Author>
                <Timestamp>{new Date(c.createdAt).toLocaleString()}</Timestamp>
                <Text>{c.text}</Text>
              </CommentItem>
            ))}
          </CommentList>

          {currentUser && (
            <form onSubmit={handleSubmit}>
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
      )}
    </CardWrapper>
  )
}

const CardWrapper = styled.article`
  width: 280px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
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
  padding: 12px 16px;
`

const Name = styled.h3`
  margin: 0 0 8px;
  font-size: 1.1rem;
`

const Meta = styled.div`
  display: flex;
  gap: 6px;
`

const Tag = styled.span`
  background: #e0f0ff;
  color: #0066cc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #0066cc;
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
  background: #f9f9f9;
  padding: 6px 8px;
  border-radius: 4px;
`

const Author = styled.span`
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
  width: 100%;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 6px;
  padding: 6px;
`

const CommentBtn = styled.button`
  background: #0077cc;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
`

const ErrorMsg = styled.p`
  color: #c00;
`