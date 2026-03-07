import express, { } from "express"
import multer from "multer"
import dotenv from "dotenv"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinaryFramework from "cloudinary"
import Cat from "../models/Cat"
import { verifyToken } from "../models/auth"
import authenticate from "../middleware/authenticate"
import { authorize } from "../middleware/authorize"


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
    transformation: [{
      width: 500,
      height: 500,
      crop: "limit",
      effect: "background_removal:fineedges"
    }],
  },
})

const parser = multer({ storage })

const router = express.Router()

// All cats
router.get("/cats", async (req, res) => {
  try {
    const cats = await Cat.find().sort({ createdAt: -1 })
    res.json(cats)

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cats" })
  }
})

// One cat
router.get("/cats/:id", async (req, res) => {
  const id = req.params.id
  try {
    const cat = await Cat.findById(id)
    res.json(cat)

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cat" })
  }
})

// Post
router.post("/cats", authenticate, authorize('admin', 'editor'), parser.single('picture'), async (req, res) => {
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

// Edit
router.put("/cats/:id", authenticate, authorize('admin', 'editor'), verifyToken, async (req, res) => {
  try {

    const editedCat = req.body

    const cat = await Cat.findById(editedCat._id)

    cat.name = editedCat.name
    cat.gender = editedCat.gender
    cat.location = editedCat.location

    await cat.save()
    res.json(cat)

  } catch (error) {
    res.status(500).json({ error: "Failed to edit cat" })
  }
})

// Delete
router.delete("/cats/:id", authenticate, authorize('admin', 'editor'), async (req, res) => {
  const id = req.params.id
  try {
    const cat = await Cat.findById(id)

    if (!cat) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "Cat not found"
      })
    }

    await Cat.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      response: id,
      message: "Cat deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: null,
      message: error,
    })
  }
})

export default router