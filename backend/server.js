import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import exitRoutes from "./routes/exitRoutes.js"
import weatherRoutes from "./routes/weather.js"
import 'dotenv/config'; 
import geoRoutes from "./routes/geo.js"
// import path from "path";
// import { fileURLToPath } from "url";

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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve Vite build files
// app.use(express.static(path.join(__dirname, "dist")));

// // SPA fallback
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})