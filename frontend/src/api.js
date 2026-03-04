export const API_URL = "http://localhost:8080"

export const fetchJson = async (url, options = {}) => {
  const token = localStorage.getItem("token")
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.message || `Status ${res.status}`
    throw new Error(msg)
  }

  return await res.json()
}