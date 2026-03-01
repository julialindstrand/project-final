import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}