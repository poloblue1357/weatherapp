import express from "express"
import Exits from "../models/Exits.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try{
        const locations = await Exits.find()
        res.json(locations)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.post("/", async (req, res) => {
    console.log("Received data:", req.body);  // Log the incoming data
    const { name, country, lat, lon, weather } = req.body;
    const location = new Exits({ name, country, lat, lon, weather });
    
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
        const location = await Exits.findByIdAndDelete(req.params.id)
        if (!location) {
            return res.status(404).json({ error: "Location not found" })
        }
        res.json({ message: "Location deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


export default router
