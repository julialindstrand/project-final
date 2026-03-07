import { useContext } from "react"
import { AuthContext } from "../components/authenticate"

export default function AdminPanel() {
  const { user } = useContext(AuthContext)

  if (!user) return <p>Please log in.</p>
  if (user.role !== "admin") return <p>Access denied – admin only</p>

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* admin‑only UI */}
    </div>
  )
}