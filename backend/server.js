import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import exitRoutes from "./routes/exitRoutes.js"
import weatherRoutes from "./routes/weatherRoutes.js"
import 'dotenv/config'; 
import geoRoutes from "./routes/geoRoutes.js"
import morgan from 'morgan'
import { Logtail } from "@logtail/node";

const app = express()

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
    endpoint: `https://${process.env.LOGTAIL_INGESTING_HOST}`,
});

// Middleware
app.use(cors())
app.use(express.json())

// app.use(morgan(":method :url :status :response-time ms"))
app.use(morgan("dev"))

// Logtail middleware
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        logtail.info("HTTP request", {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${Date.now() - start}ms`,
        });
    });

    next();
});

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