import bcrypt from "bcrypt"
import express from "express"
import dotenv from "dotenv"
import { User } from "../models/User"
import authenticate from "../middleware/authenticate"
import { authorize } from "../middleware/authorize"
import { signJwt } from "../utils/jwt.js"

dotenv.config()

const router = express.Router()

// New User
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      })
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)
    const user = new User({ name, email, password: hashedPassword })

    await user.save()

    const token = signJwt({ sub: user._id, role: user.role, name: user.name })

    res.status(201).json({
      success: true,
      message: "User created",
      response: { id: user._id, name: user.name, email: user.email, token },
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not create user',
      response: error,
    })
  }
})

// Log In
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error);
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
  authenticate,
  authorize("admin"),

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