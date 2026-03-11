import express from "express"
import authenticate from "../middleware/authenticate.js"
import authorize from "../middleware/authorize.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

const adminRouter = express.Router()

adminRouter.get(
  "/",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const stats = {
        totalUsers: await User.countDocuments(),
        totalAdmins: await User.countDocuments({ role: "admin" }),
      }
      res.status(200).json({ success: true, data: stats })
    } catch (error) {
      console.error("Admin stats error:", error)
      res.status(500).json({ success: false, message: error.message })
    }
  }
)

// Create User
adminRouter.post(
  "/users",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { name, email, role, password } = req.body

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required"
        })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create new user
      const newUser = new User({
        name,
        email,
        role: role || "user",
        password: hashedPassword
      })

      await newUser.save()

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      })
    } catch (error) {
      console.error("User creation error:", error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
)

export default adminRouter