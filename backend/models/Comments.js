import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
    },
  },
  { timestamps: true }
)

export default commentSchema