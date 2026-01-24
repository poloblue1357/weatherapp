import { XMLParser } from 'fast-xml-parser';

export const fetchWeatherData = async (location) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    let url;
    if (location.includes(',')) {
        const [lat, lon] = location.split(',');
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}&mode=xml`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}&mode=xml`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
        const errText = await response.text();
        console.error('API error response:', errText);
        throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const xmlData = await response.text();
        // console.log('Raw XML:', xmlData);

        const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        attributesGroupName: "$",
        });

        const parsedData = parser.parse(xmlData);
        // console.log("Full parsed data:", parsedData);

        return parsedData;
    } catch (error) {
        console.error('Fetch/parse failed:', error);
        return null;
    }
};

export const fetchWindGustData = async (location) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.error('OpenWeather API key is missing');
        return null;
    }

    let url;
    if (location.includes(',')) {
        const [lat, lon] = location.split(',');
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
        if (response.status === 404) {
            console.warn('Location not found');
        } else {
            throw new Error(`HTTP error ${response.status}`);
        }
        return null;
        }

        const jsonData = await response.json();
        return jsonData.wind?.gust ?? null;
    } catch (error) {
        console.error('Error fetching wind gust data:', error);
        return null;
    }
};

export const getWeatherInfo = (data, windGust) => {
    if (!data || !data.current) {
        return {};
    }

    const current = data.current;
    const timezoneOffset = current.city?.timezone || 0;

    const sunriseUTC = current.city?.sun?.$.rise || null;
    const sunsetUTC = current.city?.sun?.$.set || null;
    const lastUpdateUTC = current.lastupdate?.$.value || null;

    const windSpeedObj = current.wind?.speed?.$ || {};
    const windSpeed = windSpeedObj.value ?? "N/A";
    const windType = windSpeedObj.name ?? "N/A";

    const windDirObj = current.wind?.direction?.$ || {};
    const windDirectionName = windDirObj.name ?? "N/A";
    const windDirectionCode = windDirObj.code ?? "N/A";
    const windDirectionDegrees = windDirObj.value ?? null;

    const xmlGust = current.wind?.gusts?.$?.value ?? null;
    const finalWindGust = windGust ?? xmlGust ?? "N/A";

    const formatTime = (utcTime) => {
        if (!utcTime) return "N/A";
        const date = new Date(utcTime);
        date.setSeconds(date.getSeconds() + timezoneOffset);
        return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
        });
    };

    const getTimeAgo = (utcTime) => {
        if (!utcTime) return "N/A";
        const date = new Date(utcTime);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
    
        if (diffMins < 1) return "Just now";
        if (diffMins === 1) return "1 minute ago";
        if (diffMins < 60) return `${diffMins} minutes ago`;
    
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours === 1) return "1 hour ago";
        return `${diffHours} hours ago`;
    };

    return {
        city: current.city?.$.name || "Unknown City",
        weather: current.weather?.$.value || "No weather data",
        temperature: current.temperature?.$.value || "N/A",
        humidity: current.humidity?.$.value || "N/A",
        pressure: current.pressure?.$.value || "N/A",
        visibility: current.visibility?.$.value
        ? (parseFloat(current.visibility.$.value) / 1609.34).toFixed(1)
        : "N/A",
        windSpeed,
        windType,
        windDirection: windDirectionName,
        windDirectionCode,
        windDirectionDegrees,
        windGusts: finalWindGust === "N/A" ? "N/A" : finalWindGust,
        sunrise: formatTime(sunriseUTC),
        sunset: formatTime(sunsetUTC),
        lastUpdate: getTimeAgo(lastUpdateUTC),
    };
};