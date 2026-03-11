import bcrypt from "bcryptjs"
import express from "express"
import dotenv from "dotenv"
import User from "../models/User.js"
import { signJwt } from "../utils/jwt.js"
dotenv.config()

const router = express.Router()

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, e‑mail and password are required",
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await user.save()

    const token = signJwt({ sub: user._id, role: user.role, name: user.name })

    res.status(201).json({
      success: true,
      message: "User created",
      response: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        response: error.errors,
      })
    }
    res.status(500).json({
      success: false,
      message: "Could not create user",
      response: error.message,
    })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Wrong e‑mail or password",
        response: null,
      })
    }

    const passwordMatches = bcrypt.compareSync(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Wrong e‑mail or password",
        response: null,
      })
    }

    const token = signJwt({ sub: user._id, role: user.role, name: user.name })
    res.json({
      success: true,
      message: "Logged in successfully",
      response: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error("Login error details:", error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      response: error.message,
    })
  }
})

// Delete
router.delete(
  "/users/:id",
  async (req, res) => {
    try {
      const { id } = req.params
      const deleted = await User.findByIdAndDelete(id)
      if (!deleted) {
        return res.status(404).json({ success: false, message: "User not found" })
      }
      res.json({ success: true, message: "User removed" })
    } catch (err) {
      console.error("Delete user error:", err)
      res.status(500).json({ success: false, message: err.message })
    }
  }
)

export default router