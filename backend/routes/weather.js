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
        // console.log(response)
        const data = await parseStringPromise(response.data) // 2026-01-29T21:39:22.000Z
        // console.log(data.current)
        // function to format the sunrise/sunset
        function formatTime(rawTime, timezoneOffset) {
            // Parse the raw UTC time into a Date object
            const date = new Date(rawTime);

            // Adjust for the timezone offset (converted to milliseconds)
            const offsetDate = new Date(date.getTime() + timezoneOffset * 1000);

            // Extract hours and minutes
            let hours = offsetDate.getHours();
            let minutes = offsetDate.getMinutes();

            // Ensure minutes are always two digits
            minutes = minutes < 10 ? '0' + minutes : minutes;

            // Determine whether it's AM or PM
            let period = 'AM';
            if (hours >= 12) {
                period = 'PM';
                if (hours > 12) hours -= 12;  // Convert to 12-hour format
            } else if (hours === 0) {
                hours = 12; // Handle midnight as 12:xx AM
            }

            // Return the formatted time as a string
            // console.log(`${hours}:${minutes} ${period}`)
            return `${hours}:${minutes} ${period}`;
        }
        // function that formats the last update
        function formatLastUpdate(rawLastUpdate) {
            // console.log("Raw last update:", rawLastUpdate); // check input
            if (!rawLastUpdate) return "N/A";

            const date = new Date(rawLastUpdate); 
            const now = new Date();
            const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            
            // console.log("Now UTC:", nowUtc);
            // console.log("API date:", date);

            const diffMs = nowUtc - date;
            const diffMins = Math.floor(diffMs / 60000);
            // console.log("diffMins:", diffMins);

            if (diffMins < 1) return "Just now";
            if (diffMins === 1) return "1 minute ago";
            if (diffMins < 60) return `${diffMins} minutes ago`;

            const diffHours = Math.floor(diffMins / 60);
            // console.log("diffHours:", diffHours);
            if (diffHours === 1) return "1 hour ago";

            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) return "1 day ago";
            if (diffDays > 1) return `${diffDays} days ago`;

            return `${diffHours} hours ago`;
        }
        // Example: extract city, country, temp, wind info
        const weather = {
            city: data.current.city[0].$.name, // string "Cedar City"
            lat: parseFloat(data.current.city[0].coord[0].$.lat), // string - num w/parseFloat - 37.6775
            lon: parseFloat(data.current.city[0].coord[0].$.lon), // string - num w/ParseFloat - -113.0619
            country: data.current.city[0].country[0], // string "US"
            temp: Math.round(Number(data.current.temperature[0].$.value) * 10) / 10, // string - 33.17
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
                gust: data.current.wind[0].gust?.[0]?.$.value || "N/A" // 
            },
            sunrise: formatTime(data.current.city[0].sun[0].$.rise, data.current.city[0].timezone[0]), // string - 2026-01-29T14:39:22
            sunset: formatTime(data.current.city[0].sun[0].$.set, data.current.city[0].timezone[0]), // string - 2026-01-30T00:41:32
            lastupdate: formatLastUpdate(data.current.lastupdate[0].$.value), // string - 2026-01-30T05:59:33
            timezone: data.current.city[0].timezone[0], // string in seconds - -25200
            visibility: Math.round(Number(data.current.visibility[0].$.value) / 1609.34 * 10) / 10, // string in meters - 10000 - converted to miles
            pressure: {
                value: Number((Number(data.current.pressure[0].$.value) / 33.8639).toFixed(2)) , // string hPa - converted in inHg
                unit: 'inHg', // string hPa - converted value to inHg so updated unit
            },
            humidity: {
                value: Number(data.current.humidity[0].$.value),
                unit: data.current.humidity[0].$.unit,
            }
        }
        console.log(weather)
        res.json(weather)
        // console.log(weather.lat)
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router


// (values i need to calculate / format on the backend) - none?
// assign lat/lon to a specific value - done on the FE (local storage)
// format values properly