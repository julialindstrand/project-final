import mongoose from "mongoose"

const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
  })

const Cat = mongoose.models.Cat || mongoose.model("Cat", catSchema)

export default Cat