import { XMLParser } from 'fast-xml-parser';

export const fetchWeatherData = async (location) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    let url;
    if (location.includes(',')) {
        const [lat, lon] = location.split(',');
        url = `http://localhost:8000/api/weather?lat=${lat.trim()}&lon=${lon.trim()}`
    } else {
        url = `http://localhost:8000/api/weather?city=${encodeURIComponent(location)}`
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errText = await response.text();
            console.error('API error response:', errText);
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const jsonData = await response.json()

        return {
            current: {
                city: {
                    $: { name: jsonData.city },
                    country: [jsonData.country],
                    coord: {
                        $: {
                            lat: jsonData.lat || location.split(',')[0],
                            lon: jsonData.lon || location.split(',')[1]
                        }
                    }
                },
                temperature: {
                    $: { value: jsonData.temp }
                },
                weather: {
                    $: {
                        value: jsonData.description,
                        icon: jsonData.icon
                    }
                },
                wind: {
                    speed: {
                        $: {
                            value: jsonData.wind.speed.value,
                            unit: jsonData.wind.speed.unit,
                            name: jsonData.wind.speed.name
                        }
                    },
                    direction: {
                        $: {
                            value: jsonData.wind.direction.value,
                            code: jsonData.wind.direction.code,
                            name: jsonData.wind.direction.name
                        }
                    },
                    gusts: jsonData.wind.gust ? {
                        $: { value: jsonData.wind.gust }
                    } : undefined
                }
            }
        }

    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
};

export const fetchWindGustData = async (location) => {
    const data = await fetchWeatherData(location) 
    return data?.current?.wind?.gusts?.$?.value || null
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