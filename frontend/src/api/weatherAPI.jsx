
export const fetchWeatherData = async (location) => {
    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const API_URL = 'http://localhost:8000'
    const url = `${API_URL}/api/weather?location=${encodeURIComponent(location)}`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errText = await response.text();
            console.error('API error response:', errText);
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const jsonData = await response.json()
        return jsonData // returns formatted info from backend

    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
};
