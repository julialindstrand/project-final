import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import catRouter from "./routes/catRoutes.js"

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
app.use(express.json())
app.use("/", catRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))