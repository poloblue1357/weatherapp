import { useState, useEffect } from 'react'
import { fetchGeoData } from '../api/geoAPI'

function GeoSearch() {
    const [geoSearch, setGeoSearch] = useState(null)

    useEffect(() => {
        async function load() {
            try {
                const location = "salt lake city"
                const data = await fetchGeoData(location)
                setGeoSearch(data)
            } catch (error) {
                console.error("Failed to fetch:", error)
            }
        }
        load()
    }, [])  // Empty dependency array, meaning this runs once on component mount

    return (
        <div>
            {/* Conditionally render geoSearch */}
            {geoSearch && geoSearch.results ? (
                geoSearch.results.map(city => (
                    <div key={city.place_id} className="m-5 text-white">
                        {city.formatted} {/* or whatever field you want to display */}
                    </div>
                ))
            ) : (
                <div>Loading...</div> // Display loading message if geoSearch is still null
            )}
        </div>
    )
}

export default GeoSearch
