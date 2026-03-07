import { authenticate } from "../middleware/authenticate.js"
import { User } from "../models/User.js"

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = authenticate(token)
    const user = await User.findById(decoded.sub)
    if (!user) throw new Error("User not found")

    req.user = {
      id: user._id,
      name: user.name,
      role: user.role,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: `Invalid token: ${err.message}` })
  }
}