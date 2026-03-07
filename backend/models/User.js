import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  token: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
})

export const User = mongoose.model('User', UserSchema)