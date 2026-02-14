
export const fetchGeoData = async (location) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const url = `${API_URL}/api/geo/autocomplete?text=${encodeURIComponent(location)}&limit=5`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errText = await response.text();
            console.error('geoAPI error:', errText);
            throw new Error(`HTTP ${response.status}: ${errText}`); // Fixed: changed to template literal
        }
        const geoData = await response.json()
        // console.log(geoData)
        return geoData
    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
}