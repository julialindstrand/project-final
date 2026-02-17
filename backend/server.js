import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cloudinaryFramework from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const cloudinary = cloudinaryFramework.v2; 
cloudinary.config({
  cloud_name: 'dzbwzwskg', // this needs to be whatever you get from cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pets',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
})
const parser = multer({ storage })

app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})

const Pet = mongoose.model('Pet', {
  name: String,
  imageUrl: String
})

app.post('/cats', parser.single('image'), async (req, res) => {
  try {
    const pet = await new Pet({ name: req.body.filename, imageUrl: req.file.path }).save()
    res.json(pet)
  } catch (err) {
    res.status(400).json({ errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})