import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "../routes/userRoutes"

dotenv.config

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const existingUser = await User.findOne({
      token: token
    })

    if (!existingUser) {
      throw new Error("No user found")
    }

    req.user = {
      id: existingUser.id,
      name: existingUser.name,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: `Invalid token: ${err}` })
  }
}