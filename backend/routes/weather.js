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
            // console.log("params.q:", params.q)
        } else {
            params.lat = lat
            params.lon = lon
            // console.log("params.lat", params.lat)
            // console.log("params.lon", params.lon)
        }

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params }
        )
        
        const data = await parseStringPromise(response.data)
        console.log(data.current.wind[0].gust?.[0]?.$.value)
        console.log(typeof data.current.wind[0].gust?.[0]?.$.value)
        
        // Example: extract city, country, temp, wind info
        const weather = {
            city: data.current.city[0].$.name, // string "Cedar City"
            lat: parseFloat(data.current.city[0].coord[0].$.lat), // string - num w/parseFloat - 37.6775
            lon: parseFloat(data.current.city[0].coord[0].$.lon), // string - num w/ParseFloat - -113.0619
            country: data.current.city[0].country[0], // string "US"
            temp: data.current.temperature[0].$.value, // string - 33.17
            description: data.current.weather[0].$.value, // string - clear sky
            icon: data.current.weather[0].$.icon, // string - 01n
            wind: {
                speed: {
                    value: data.current.wind[0].speed[0].$.value, // string - 9.22
                    unit: data.current.wind[0].speed[0].$.unit, // string - mph
                    name: data.current.wind[0].speed[0].$.name // string - Gentle Breeze
                },
                direction: {
                    value: data.current.wind[0].direction[0].$.value, // string - 20
                    code: data.current.wind[0].direction[0].$.code, // string - NNE
                    name: data.current.wind[0].direction[0].$.name // string - North-northeast
                },
                // Always include gust key; null if missing
                gust: data.current.wind[0].gust?.[0]?.$.value || null // 
            }
        }

        res.json(weather)
        // console.log(res.json())
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router
