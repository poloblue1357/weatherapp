import express from "express"
import axios from "axios"
import { parseStringPromise } from "xml2js"

function convertDegreesToCode(degrees) {
    const deg = parseFloat(degrees);
    if (deg >= 348.75 || deg < 11.25) return 'N';
    if (deg >= 11.25 && deg < 33.75) return 'NNE';
    if (deg >= 33.75 && deg < 56.25) return 'NE';
    if (deg >= 56.25 && deg < 78.75) return 'ENE';
    if (deg >= 78.75 && deg < 101.25) return 'E';
    if (deg >= 101.25 && deg < 123.75) return 'ESE';
    if (deg >= 123.75 && deg < 146.25) return 'SE';
    if (deg >= 146.25 && deg < 168.75) return 'SSE';
    if (deg >= 168.75 && deg < 191.25) return 'S';
    if (deg >= 191.25 && deg < 213.75) return 'SSW';
    if (deg >= 213.75 && deg < 236.25) return 'SW';
    if (deg >= 236.25 && deg < 258.75) return 'WSW';
    if (deg >= 258.75 && deg < 281.25) return 'W';
    if (deg >= 281.25 && deg < 303.75) return 'WNW';
    if (deg >= 303.75 && deg < 326.25) return 'NW';
    if (deg >= 326.25 && deg < 348.75) return 'NNW';
    return 'N';
}

const router = express.Router()

// GET  zip/lat,lon/city
router.get("/", async (req, res) => {
    const { location } = req.query;
    let units = (req.query.units || 'imperial').trim()

    if (!location) {
        return res.status(400).json({ error: "Location is required" })
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
        params.zip = `${location},US`;
    } else {
        params.q = location;
    }

    try {
        // Fetch 5-day forecast data
        const fiveDayResponse = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast',
            { params: { ...params, mode: 'json' } }
        )
        const fiveDayData = fiveDayResponse.data

        // Fetch current weather in XML format
        const xmlResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params: { ...params, mode: "xml" } }
        )
        const xmlData = await parseStringPromise(xmlResponse.data)
        
        // Fetch current weather in JSON format (for wind gusts)
        const jsonResponse = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            { params }
        )
        const jsonData = jsonResponse.data

        // Function to format the sunrise/sunset
        function formatTime(rawTime, timezoneOffset) {
            try {
                const date = new Date(rawTime);
               
                if (isNaN(date.getTime())) {
                    return "N/A";
                }

                // Adjust for the timezone offset (converted to milliseconds)
                const offsetDate = new Date(date.getTime() + timezoneOffset * 1000);

                // Extract UTC hours and minutes after offset
                let hours = offsetDate.getUTCHours();
                let minutes = offsetDate.getUTCMinutes();

                // Ensure minutes are always two digits
                minutes = minutes < 10 ? '0' + minutes : minutes;

                // Determine whether it's AM or PM
                let period = 'AM';
                if (hours >= 12) {
                    period = 'PM';
                    if (hours > 12) hours -= 12;
                } else if (hours === 0) {
                    hours = 12;
                }

                return `${hours}:${minutes} ${period}`;
            } catch (error) {
                console.error("Error formatting time:", error);
                return "N/A";
            }
        }

        // Function that formats the last update
        function formatLastUpdate(rawLastUpdate) {
            if (!rawLastUpdate) return "N/A";

            try {
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
                if (diffHours < 24) return `${diffHours} hours ago`;

                const diffDays = Math.floor(diffHours / 24);
                if (diffDays === 1) return "1 day ago";
                return `${diffDays} days ago`;
            } catch (error) {
                console.error("Error formatting last update:", error);
                return "N/A";
            }
        }

        const windSpeed = xmlData.current.wind[0].speed[0].$.value;
        const windGust = jsonData.wind?.gust;

        const weather = {
            city: xmlData.current.city[0].$.name,
            lat: parseFloat(xmlData.current.city[0].coord[0].$.lat),
            lon: parseFloat(xmlData.current.city[0].coord[0].$.lon),
            country: xmlData.current.city[0].country[0],
            temp: Math.round(Number(xmlData.current.temperature[0].$.value) * 10) / 10,
            weather: {
                condition: xmlData.current.weather[0].$.value,
                icon: xmlData.current.weather[0].$.icon
            },
            windSpeed: windSpeed,
            windType: xmlData.current.wind[0].speed[0].$.name,
            windDirection: xmlData.current.wind[0].direction[0].$.name,
            windDirectionCode: xmlData.current.wind[0].direction[0].$.code,
            windDirectionDegrees: xmlData.current.wind[0].direction[0].$.value,
            windGusts: (windGust && windGust !== windSpeed) ? windGust : "N/A",
            sunrise: formatTime(xmlData.current.city[0].sun[0].$.rise, xmlData.current.city[0].timezone[0]),
            sunset: formatTime(xmlData.current.city[0].sun[0].$.set, xmlData.current.city[0].timezone[0]),
            lastUpdate: formatLastUpdate(xmlData.current.lastupdate[0].$.value),
            timezone: xmlData.current.city[0].timezone[0],
            visibility: Math.round(Number(xmlData.current.visibility[0].$.value) / 1609.34 * 10) / 10,
            pressure: Number((Number(xmlData.current.pressure[0].$.value) / 33.8639).toFixed(2)),
            humidity: Number(xmlData.current.humidity[0].$.value),
        }

        // Process 5-day forecast data
        const forecast = {
            
        }

        res.json({ weather, forecast })
    } catch (error) {
        console.error("OpenWeatherMap error:", error.response?.data || error.message)
        res.status(500).json({ error: "Failed to fetch weather data" })
    }
})

export default router