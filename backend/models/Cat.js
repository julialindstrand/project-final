import mongoose from "mongoose"
import commentSchema from "./Comments.js"

const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    comments: [commentSchema], default: [],
  }, { timestamps: true })

export default mongoose.models.Cat || mongoose.model("Cat", catSchema)