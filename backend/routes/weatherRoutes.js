import express from "express"
import axios from "axios"
import { parseStringPromise } from "xml2js"
import { getWeatherByCoords } from "../helpers/weatherHelper.js";

const router = express.Router()

// GET  zip/lat,lon/city
router.get("/", async (req, res) => {
    const { location } = req.query;
    let units = (req.query.units || 'imperial').trim()

    if (!location) {
        return res.status(400).json({ error: "Location is required" })
    }

    // DECODE the location first (handles URL encoding)
    const decodedLocation = decodeURIComponent(location);

    // determine type of location
    const isLatLon = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(decodedLocation);
    const isZip = /^\d{5}$/.test(decodedLocation);

    let lat, lon;

    try {
        if (isLatLon) {
            // Already have lat/lon from user input
            [lat, lon] = decodedLocation.split(",");
            lat = parseFloat(lat.trim());
            lon = parseFloat(lon.trim());
        } else {
            // Need to convert zip or city to lat/lon first
            const params = {
                appid: process.env.OPENWEATHER_API_KEY,
                units
            };

            if (isZip) {
                params.zip = `${decodedLocation},US`;
            } else {
                params.q = decodedLocation;
            }

            // Call OpenWeather API to get coordinates
            const geoResponse = await axios.get(
                "https://api.openweathermap.org/data/2.5/weather",
                { params }
            );
           
            lat = geoResponse.data.coord.lat;
            lon = geoResponse.data.coord.lon;
        }

        // NOW we have lat/lon, call the helper
        const data = await getWeatherByCoords(lat, lon, units)
        res.json(data)
       
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router

