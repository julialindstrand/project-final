import jwt from "jsonwebtoken"

export const signJwt = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env")
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const verifyJwt = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env")
  }
  return jwt.verify(token, process.env.JWT_SECRET)
}