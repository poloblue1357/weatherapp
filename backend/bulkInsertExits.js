import mongoose from "mongoose";
import fs from "fs";
import 'dotenv/config';
import Exit from "./models/Exit.js"; // adjust if your model is in another folder

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Load JSON data from scraper folder
const rawData = fs.readFileSync('../scraper/dropzones_v3.json'); // relative path from backend/
const exits = JSON.parse(rawData);

// Insert into MongoDB
const insertExits = async () => {
    try {
        await Exit.insertMany(exits, { ordered: false }); // ordered:false continues if some fail
        console.log("All exits inserted!");
    } catch (err) {
        console.error("Error inserting exits:", err);
    } finally {
        mongoose.connection.close();
    }
};

insertExits();