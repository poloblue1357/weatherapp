import express from "express"
import Exit from "../models/Exit.js"
import axios from 'axios'
import { getWeatherByCoords } from "../helpers/weatherHelper.js"

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

// Get exit + weather combined
router.get('/weather', async (req, res) => {
    const { query } = req.query

    try {
        const exit = await Exit.findOne({
            name: { $regex: query, $options: 'i'}
        })

        if(!exit) {
            return res.status(404).json({ error: "Exit not found" })
        }

        const weatherData = await getWeatherByCoords(exit.lat, exit.lon)

        res.json({
            exitName: exit.name,
            city: exit.city,
            state: exit.state,
            lat: exit.lat, 
            lon: exit.lon,
            ...weatherData
        })
    } catch (error) {
        console.error("Exit weather error:", error.message)
        res.status(500).json({ error: "Failed to fetch exit weather =" })
    }
})

export default router
