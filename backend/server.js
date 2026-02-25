import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import catRouter from "./routes/catRoutes.js"
import userRouter from "./routes/userRoutes.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/", catRouter)
app.use("/", userRouter)

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

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))