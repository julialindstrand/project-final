import { useCallback } from "react"
import { fetchJson } from "../api/api"

export const useComments = () => {

  // Add
  const createComment = useCallback(async (catId, text) => {
    const newComment = await fetchJson(`/comments/${catId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text: text.trim() }),
    })
    return newComment // ← return it so CatCard can use it
  }, [])

  // Delete
  const deleteComment = useCallback(async (catId, commentId) => {
    return await fetchJson(`/comments/${catId}/comments/${commentId}`, { // ← fixed path
      method: "DELETE",
    })
  }, [])

  return { createComment, deleteComment }
}

export default useComments