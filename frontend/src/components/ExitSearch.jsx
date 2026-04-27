import { useState, useEffect } from "react"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import { fetchExitData, fetchExitWeather } from "../api/exitAPI"
import Spinner from "../components/Spinner"
import ExitAutocomplete from "./ExitAutocomplete";
import { useApp } from '../hooks/useApp';


const T = {
    tabBar:      { background: "#2C2C2E", borderRadius: 12, padding: 4, display: "flex", gap: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    tabActive:   { background: "linear-gradient(to right, rgb(168, 85, 247), rgb(99, 102, 241))", color: "#FFFFFF" },
    tabInactive: { background: "transparent", color: "rgba(235,235,245,0.55)" },
};

function ExitSearch() {
    const [searchInput, setSearchInput] = useState('')
    const [selectedExit, setSelectedExit] = useState('')
    const [activeTab, setActiveTab] = useState('current')
    const [loading, setLoading] = useState(false)
    const [autocompleteResults, setAutocompleteResults] = useState([])
    const [error, setError] = useState(null)

    const {
        addFavorite,
        removeFavorite,
        isFavorited,
        currentExitData,
        updateExitWeather
    } = useApp();

    // Use persistent exit data from context
    const weatherData = currentExitData;

    // Check if current location is favorited
    const isFavorite = weatherData?.weather?.lat && weatherData?.weather?.lon
        ? isFavorited(weatherData.weather.lat, weatherData.weather.lon)
        : false;

    const toggleFavorite = () => {
        if (!weatherData?.weather?.lat || !weatherData?.weather?.lon) return;
        // Use exitName if available, otherwise fall back to city
        const exitName = weatherData.exitName || weatherData.weather.city;
        // console.log('Toggling favorite with name:', exitName);
        // console.log('Full weatherData:', weatherData);
        if (isFavorite) {
            removeFavorite(`${weatherData.weather.lat}-${weatherData.weather.lon}`);
        } else {
            addFavorite({ 
                name: exitName, 
                lat: weatherData.weather.lat, 
                lon: weatherData.weather.lon 
            });
        }
    };

    const handleChange = (e) => {
        const value = e.target.value
        setError(null)
        setSearchInput(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const term = searchInput
        if(!term) {
            setError("Search Field Can't be Blank")
            return
        }
        searchLocation(term)
    }

    const searchLocation = async (term) => {
        setLoading(true)
        if (!term || term.length <= 2) {
            setLoading(false)
            return
        }

        try {
            const data = await fetchExitWeather(term)

            if (!data) throw new Error('Invalid data format')

            const modifiedData = {
                ...data,
                exitName: data.exitName,  // Preserve exitName at top level
                weather: {
                    ...data.weather,
                    city: data.exitName || data.weather.city
                }
            }
            // console.log('Modified data with exitName:', modifiedData)
            updateExitWeather(modifiedData)
            setAutocompleteResults([])
            setSearchInput('')
            setSelectedExit('')

        } catch (err) {
            console.error(err)
            setError("Search result isn't available")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!searchInput || searchInput.length <= 2) {
            setAutocompleteResults([])
            return
        }

        // 🚫 don't refetch when user just selected something
        if (searchInput === selectedExit) return

        const timeout = setTimeout(async () => {
            const data = await fetchExitData(searchInput)
            setAutocompleteResults(data)
        }, 200)

        return () => clearTimeout(timeout)
    }, [searchInput, selectedExit])

    return (
        <div>
            {/* Search Input */}
            <div className="relative">
                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                        <input
                            style={{
                                width: '100%',
                                padding: '20px 64px 20px 20px',
                                border: 0,
                                borderRadius: '16px',
                                fontSize: '16px',
                                background: 'white',
                                boxSizing: 'border-box',
                                outline: 'none'
                            }}
                            placeholder="Search by DZ or Exit name"
                            onChange={handleChange}
                            value={searchInput}
                        />
                        <button
                            type="submit"
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'linear-gradient(to right, rgb(14, 165, 233), rgb(59, 130, 246))',
                                border: 'none',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" fill="none"/>
                                <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="absolute w-full z-10">
                    <ExitAutocomplete 
                        searchInput={searchInput} 
                        autocompleteResults={autocompleteResults}
                        searchLocation={searchLocation}
                        setAutocompleteResults={setAutocompleteResults}
                        setSearchInput={setSearchInput}
                        setSelectedExit={setSelectedExit}
                    />
                </div>
            </div>
            
            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 mt-4">
                    {error}
                </div>
            )}

            {/* 32px spacing */}
            <div style={{ height: '32px' }}></div>

            {loading &&
                <Spinner />
            }

            {/* Weather Results */}
            {weatherData && (
                <>
                    {/* Current/Forecast Tabs */}
                    <div style={T.tabBar}>
                        {["current", "forecast"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                                    fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                                    ...(activeTab === tab ? T.tabActive : T.tabInactive),
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Weather Content */}
                    {activeTab === 'current' ? (
                        <WeatherCard 
                            weatherInfo={weatherData.weather}
                            lat={weatherData.weather.lat}
                            lon={weatherData.weather.lon}
                            isFavorite={isFavorite}
                            onToggleFavorite={toggleFavorite}
                        />
                    ) : (
                        <Forecast 
                            forecastInfo={weatherData.forecast} 
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default ExitSearch

