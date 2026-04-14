import express from "express"
import Exit from "../models/Exit.js"
import axios from 'axios'

const router = express.Router()

router.get("/", async (req, res) => {
    const { location } = req.query;
    try {
        const query = location
            ? { name: { $regex: location.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&").replace(/s$/, "('s)?"), $options: "i" } }
            : {};
        const results = await Exit.find(query);
        // console.log(results[0].lat)
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    console.log("Received data:", req.body);  // Log the incoming data
    const { id, slug, telephone, website, city, country, lat, lon, name, email, zip, state, source } = req.body;
    const location = new Exit({ id, slug, telephone, website, city, country, lat, lon, name, email, zip, state, source });
    
    try {
        const savedLocation = await location.save();
        res.status(201).json(savedLocation);
    } catch (err) {
        console.error("Error saving location:", err);  // Log any error
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/exits/:id
router.delete("/:id", async (req, res) => {
    try {
        const location = await Exit.findByIdAndDelete(req.params.id)
        if (!location) {
            return res.status(404).json({ error: "Location not found" })
        }
        res.json({ message: "Location deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router
