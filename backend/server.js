import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes.js"
import catRouter from "./routes/catRoutes.js"
import commentRouter from "./routes/commentRoutes.js"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => {
    console.error("MongoDB connection error:", e)
    process.exit(1)
  })

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.use("/users", userRouter)
app.use("/", catRouter)
app.use("/", commentRouter)
app.use("*", (req, res) => res.status(404).json({ message: "Not Found" }))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))