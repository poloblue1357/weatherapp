// fetchWeatherData.js
export const fetchWeatherData = async (location) => {
  // Use localhost if running on your machine (dev), otherwise use the Render URL from .env
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : import.meta.env.VITE_API_URL

    const url = `${API_URL}/api/weather?location=${encodeURIComponent(location || '')}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
        const errText = await response.text()
        console.error('API error response:', errText)
        throw new Error(`HTTP ${response.status}: ${errText}`)
        }
        const jsonData = await response.json()
        return jsonData
    } catch (error) {
        console.error('Fetch failed:', error)
        return null
    }
}

