import express from "express"
import Location from "../models/Location.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try{
        const locations = await Location.find()
        res.json(locations)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.post("/", async (req, res) => {
    const { name, country, lat, lon } = req.body
    const location = new Location({ name, country, lat, lon })
    
    try {
        const savedLocation = await location.save()
        res.status(201).json(savedLocation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

export default router
