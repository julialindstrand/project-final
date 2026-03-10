import { useCallback } from "react"
import { fetchJson } from "../api/api"

export const useComments = () => {

  // Add
  const createComment = useCallback(async (catId, text) => {
    await fetchJson(`/cats/${catId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text: text.trim() }),
    })
  }, [])

  // Delete
  const deleteComment = useCallback(async (catId, commentId) => {
    await fetchJson(`/cats/${catId}/comments/${commentId}`, {
      method: "DELETE",
    })
  }, [])

  return { createComment, deleteComment }
}

export default useComments