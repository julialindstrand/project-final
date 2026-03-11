import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.sub)
    if (!user) throw new Error("User not found")

    req.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: `Invalid token: ${err.message}` })
  }
}
