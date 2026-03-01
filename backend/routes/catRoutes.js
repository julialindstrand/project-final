import express, { } from "express"
import multer from "multer"
import dotenv from "dotenv"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinaryFramework from "cloudinary"
import Cat from "../models/Cat"

dotenv.config()

// Cloudinary
const cloudinary = cloudinaryFramework.v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cats",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
})

const parser = multer({ storage })

const router = express.Router()

// All cats
router.get("/cats", async (req, res) => {
  try {
    const cats = await Cat.find().sort({ createdAt: "desc" })
    res.json(cats)

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cats" })
  }
})

// Post
router.post("/cats", parser.single('picture'), async (req, res) => {
  try {

    const { filename, gender, location } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Image file missing" })
    }
    if (!filename || !gender || !location) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const cat = await new Cat({
      name: filename,
      imageUrl: req.file.path,
      gender,
      location,
    }).save()

    res.status(201).json(cat)
  } catch (err) {
    console.error('Save error:', err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors })
    }
    res.status(500).json({ message: err.message || 'Server error' })
  }
})

export default router