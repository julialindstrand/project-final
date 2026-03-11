export const API_URL = import.meta.env.VITE_API_URL || "https://api.render.com/deploy/srv-d6onvbqa214c73bfjus0?key=kG1oUUp7PgU"


export const fetchJson = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    const text = await res.text()
    throw new Error(
      `Expected JSON but got ${contentType}. Response body:\n${text.slice(
        0,
        200
      )}…`
    )
  }

  if (!res.ok) {
    const errPayload = await res.json().catch(() => ({}))
    const msg = errPayload.message || `Status ${res.status}`
    throw new Error(msg)
  }

  return res.json()
}