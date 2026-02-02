import express from "express"
import axios from "axios"
import { parseStringPromise } from "xml2js"

const router = express.Router()

// GET  zip/lat,lon/city
router.get("/", async (req, res) => {
    const { location} = req.query;
    let units = (req.query.units || 'imperial').trim()

    if(!location) {
        return res.status(400).json({ error: "Location is required"})
    }

    const params = {
        appid: process.env.OPENWEATHER_API_KEY,
        units
    }

    // determine type of location 
    const isLatLon = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(location);
    const isZip = /^\d{5}$/.test(location);

    if (isLatLon) {
        const [lat, lon] = location.split(",");
        params.lat = parseFloat(lat.trim());
        params.lon = parseFloat(lon.trim());
    } else if (isZip) {
        params.zip = `${location},US`; // optionally add country
    } else {
        params.q = location;
    }
    try {
        const fiveDayReponse = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast',
            { params: { ...params, mode: 'json'}}
        )
        const fiveDayData = fiveDayReponse.data
        console.log(fiveDayData)
        const xmlResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params: { ...params, mode: "xml" } }
        )
        const xmlData = await parseStringPromise(xmlResponse.data) // 2026-01-29T21:39:22.000Z

        const jsonResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params }
        )
        const jsonData = jsonResponse.data

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
            return `${hours}:${minutes} ${period}`;
        }
        // function that formats the last update
        function formatLastUpdate(rawLastUpdate) {
            if (!rawLastUpdate) return "N/A";

            const date = new Date(rawLastUpdate); 
            const now = new Date();
            const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

            const diffMs = nowUtc - date;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) return "Just now";
            if (diffMins === 1) return "1 minute ago";
            if (diffMins < 60) return `${diffMins} minutes ago`;

            const diffHours = Math.floor(diffMins / 60);

            if (diffHours === 1) return "1 hour ago";

            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) return "1 day ago";
            if (diffDays > 1) return `${diffDays} days ago`;

            return `${diffHours} hours ago`;
        }

        const windSpeed = xmlData.current.wind[0].speed[0].$.value;
        const windGust = jsonData.wind?.gust

        const weather = {
            city: xmlData.current.city[0].$.name, // string "Cedar City"
            lat: parseFloat(xmlData.current.city[0].coord[0].$.lat), // string - num w/parseFloat - 37.6775
            lon: parseFloat(xmlData.current.city[0].coord[0].$.lon), // string - num w/ParseFloat - -113.0619
            country: xmlData.current.city[0].country[0], // string "US"
            temp: Math.round(Number(xmlData.current.temperature[0].$.value) * 10) / 10, // string - 33.17
            weather: xmlData.current.weather[0].$.value, // string - clear sky
            icon: xmlData.current.weather[0].$.icon, // string - 01n
            windSpeed: xmlData.current.wind[0].speed[0].$.value,
            windType: xmlData.current.wind[0].speed[0].$.name,
            windDirection: xmlData.current.wind[0].direction[0].$.name,
            windDirectionCode: xmlData.current.wind[0].direction[0].$.code,
            windDirectionDegrees: xmlData.current.wind[0].direction[0].$.value,
            windGusts: (windGust && windGust !== windSpeed) ? windGust : "N/A",
            sunrise: formatTime(xmlData.current.city[0].sun[0].$.rise, xmlData.current.city[0].timezone[0]), // string - 2026-01-29T14:39:22
            sunset: formatTime(xmlData.current.city[0].sun[0].$.set, xmlData.current.city[0].timezone[0]), // string - 2026-01-30T00:41:32
            lastupdate: formatLastUpdate(xmlData.current.lastupdate[0].$.value), // string - 2026-01-30T05:59:33
            timezone: xmlData.current.city[0].timezone[0], // string in seconds - -25200
            visibility: Math.round(Number(xmlData.current.visibility[0].$.value) / 1609.34 * 10) / 10, // string in meters - 10000 - converted to miles
            pressure: Number((Number(xmlData.current.pressure[0].$.value) / 33.8639).toFixed(2)),
            humidity: Number(xmlData.current.humidity[0].$.value),
        }

        const forecast = {

        }

        res.json({ weather, forecast })
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router


