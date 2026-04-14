import { useState } from "react"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import { fetchExitWeather } from "../api/exitAPI"
import Spinner from "../components/Spinner"

const T = {
    tabBar:      { background: "#2C2C2E", borderRadius: 12, padding: 4, display: "flex", gap: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    tabActive:   { background: "linear-gradient(to right, rgb(168, 85, 247), rgb(99, 102, 241))", color: "#FFFFFF" },
    tabInactive: { background: "transparent", color: "rgba(235,235,245,0.55)" },
};

function ExitSearch() {
    const [searchInput, setSearchInput] = useState('')
    const [testSearch, setTestSearch] = useState([])
    const [activeTab, setActiveTab] = useState('current')
   
    const handleChange = (e) => {
        const value = e.target.value
        setSearchInput(value)
    }
   
    const searchLocation = async (e, searchInput) => {
        e.preventDefault()
        setSearchInput('')
        try {
            const data = await fetchExitWeather(searchInput)
            console.log("Exit weather data:", data)
            if(data) {

                const modifiedData = {
                    ...data,
                    weather: {
                        ...data.weather,
                        city: data.exitName || data.weather.city
                    }
                }
                setTestSearch(modifiedData)
            } else {
                throw new Error('Invalid data format')
            }
        } catch (err) {
            console.error('fetch error: ', err)
        }
    }
   
    return (
        <div>
            {/* Search Input */}
            <form onSubmit={((e) => searchLocation(e, searchInput))} style={{ marginBottom: '24px' }}>
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

            {/* 32px spacing */}
            <div style={{ height: '32px' }}></div>

            {/* Weather Results */}
            {Object.keys(testSearch).length > 0 && (
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
                            weatherInfo={testSearch.weather} 
                        />
                    ) : (
                        <Forecast 
                            forecastInfo={testSearch.forecast} 
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default ExitSearch