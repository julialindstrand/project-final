import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    catId: { type: mongoose.Schema.Types.ObjectId, ref: "Cat", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true, minlength: 1 },
  },
  { timestamps: true }
)

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema)