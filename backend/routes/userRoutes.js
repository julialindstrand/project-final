import bcrypt from "bcrypt"
import crypto from "crypto"
import express from "express"
import mongoose from "mongoose"

const router = express.Router()

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
})

export const User = mongoose.model('User', UserSchema)


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

    res.status(200).json({
      success: true,
      message: "User created successfully",
      response: {
        name: user.name,
        email: user.email,
        id: user._id,
        accessToken: user.accessToken,
      },
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        message: "Logged in successfully",
        response: {
          id: user._id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken
        },
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Wrong e-mail or password",
        response: null,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      response: error
    })
  }
})

export default router