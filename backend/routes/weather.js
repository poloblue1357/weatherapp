import express from "express"
import axios from "axios"
import { parseStringPromise } from "xml2js"

const router = express.Router()

// GET /api/weather?city=CityName or /api/weather?lat=xx&lon=yy
router.get("/", async (req, res) => {
    const { city } = req.query;
    let lat = req.query.lat;
    let lon = req.query.lon;
    let units = (req.query.units || "imperial").trim();

    // Require either city OR both lat & lon
    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: "City or lat/lon is required" })
    }

        // Convert lat/lon to numbers if provided
    if (lat) lat = parseFloat(lat);
    if (lon) lon = parseFloat(lon);

    // console.log("Using API Key:", process.env.OPENWEATHER_API_KEY)
    // console.log("Query params:", req.query)

    try {
        // Set up API request parameters
        const params = {
            appid: process.env.OPENWEATHER_API_KEY,
            units,
            mode: "xml" // using XLM API to get full wind info
        }

        if (city) {
            params.q = city
        } else {
            params.lat = lat
            params.lon = lon
        }

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params }
        )

        const data = await parseStringPromise(response.data)
        
        // Example: extract city, country, temp, wind info
        const weather = {
            city: data.current.city[0].$.name,
            lat: parseFloat(data.current.city[0].coord[0].$.lat),
            lon: parseFloat(data.current.city[0].coord[0].$.lon),
            country: data.current.city[0].country[0],
            temp: data.current.temperature[0].$.value,
            description: data.current.weather[0].$.value,
            icon: data.current.weather[0].$.icon,
            wind: {
                speed: {
                    value: data.current.wind[0].speed[0].$.value,
                    unit: data.current.wind[0].speed[0].$.unit,
                    name: data.current.wind[0].speed[0].$.name
                },
                direction: {
                    value: data.current.wind[0].direction[0].$.value,
                    code: data.current.wind[0].direction[0].$.code,
                    name: data.current.wind[0].direction[0].$.name
                },
                // Always include gust key; null if missing
                gust: data.current.wind[0].gust?.[0]?.$.value || null
            }
        }

        res.json(weather)
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router
