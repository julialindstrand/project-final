export const API_URL = "http://localhost:8080";

export const fetchJson = async (API_URL, options = {}) => {
  const res = await fetch(API_URL, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    const msg = errBody.message || `Status ${res.status}`
    throw new Error(msg)
  }

  return await res.json()
}