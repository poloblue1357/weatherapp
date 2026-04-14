import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import exitRoutes from "./routes/exitRoutes.js"
import weatherRoutes from "./routes/weatherRoutes.js"
import 'dotenv/config'; 
import geoRoutes from "./routes/geoRoutes.js"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use("/api/exits", exitRoutes)
app.use("/api/weather", weatherRoutes)
app.use('/api/geo', geoRoutes)

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