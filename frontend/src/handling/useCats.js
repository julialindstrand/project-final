import { useState, useCallback } from "react"
import { fetchJson } from "../api/api"

export const useCats = () => {
  const [cats, setCats] = useState([])

  const loadCats = useCallback(async () => {
    const data = await fetchJson("/cats")
    setCats(data)
  }, [])

  const addCat = useCallback((catFromServer) => {
    if (!catFromServer || !catFromServer._id) {
      console.error("Invalid cat data received:", catFromServer)
      return
    }
    const formatted = {
      id: catFromServer._id,
      _id: catFromServer._id,
      name: catFromServer.name,
      imageUrl: catFromServer.imageUrl,
      gender: catFromServer.gender,
      location: catFromServer.location,
      userId: catFromServer.userId,
    }
    setCats((prev) => [formatted, ...prev])
  }, [])

  // Edit
  const editCat = useCallback(async (catId, updates) => {
    await fetchJson(`/cats/${catId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
    await loadCats()
  }, [loadCats])

  // Delete
  const deleteCat = useCallback(async (catId) => {
    await fetchJson(`/cats/${catId}`, { method: "DELETE" })
    setCats((prev) => prev.filter((c) => c._id !== catId))
  }, [])

  return { cats, loadCats, addCat, editCat, deleteCat }
}

export default useCats