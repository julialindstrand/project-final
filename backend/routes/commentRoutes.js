import express from "express"
import { verifyToken } from "../models/auth.js"
import Cat from "../models/Cat.js"

const router = express.Router()

// Comments
router.get("/:catId/comments", async (req, res) => {
  const { catId } = req.params
  try {
    const cat = await Cat.findById(catId).select("comments")
    if (!cat) return res.status(404).json({ message: "Cat not found" })

    // Sort newest first (optional)
    const sorted = cat.comments.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    res.json(sorted)
  } catch (err) {
    console.error("Get comments error:", err)
    res.status(500).json({ message: err.message || "Server error" })
  }
})

// Post comment
router.post("/:catId/comments", verifyToken, async (req, res) => {
  const { catId } = req.params
  const { text } = req.body

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text cannot be empty" })
  }

  try {
    const cat = await Cat.findById(catId)
    if (!cat) return res.status(404).json({ message: "Cat not found" })

    // New comment
    cat.comments.push({
      userId: req.user.id,
      userName: req.user.name,
      text: text.trim(),
    })

    await cat.save()

    const newComment = cat.comments[cat.comments.length - 1]
    res.status(201).json(newComment)
  } catch (err) {
    console.error("Create comment error:", err)
    res.status(500).json({ message: err.message || "Server error" })
  }
})

export default router