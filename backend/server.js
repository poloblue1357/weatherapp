import express from "express";
import axios from "axios"
import cors from "cors";
import mongoose from "mongoose"
import dotenv from "dotenv"
import locationRoutes from "./routes/location.js"
import weatherRoutes from "./routes/weather.js"

// Load .env
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use("/api/locations", locationRoutes)
app.use("/api/weather", weatherRoutes)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error", err))

    // Test route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})