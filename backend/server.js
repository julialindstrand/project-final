import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final-project"
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

import userRouter from "./routes/userRoutes.js"
import catRouter from "./routes/catRoutes.js"
import commentRouter from "./routes/commentRoutes.js"
import adminRouter from "./routes/adminRoutes"

app.use("/admin", adminRouter)
app.use("/users", userRouter)
app.use("/", catRouter)
app.use("/comments", commentRouter)
app.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" })
})


// Server start
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})