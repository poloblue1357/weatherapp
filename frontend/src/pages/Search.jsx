import { useState, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { fetchWeatherData } from '../api/weatherAPI';
import WeatherCard from '../components/WeatherCard';
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useApp } from '../hooks/useApp';
import Forecast from '../components/Forecast';
import GeoSearch from '../components/GeoSearch';
import Spinner from '../components/Spinner'

// ── Apple dark palette ─────────────────────────────────────────
const T = {
    tabBar:      { background: "#2C2C2E", borderRadius: 12, padding: 4, display: "flex", gap: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    tabActive:   { background: "linear-gradient(to right, rgb(168, 85, 247), rgb(99, 102, 241))", color: "#FFFFFF" },
    tabInactive: { background: "transparent", color: "rgba(235,235,245,0.55)" },
};

function Search() {
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('current');
    const [geoSearch, setGeoSearch] = useState(null);
    const geoSearchRef = useRef();
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        addFavorite,
        removeFavorite,
        isFavorited,
        currentWeather,
        currentForecast,
        currentLocation,
        updateWeather
    } = useApp();

    const isFavorite = currentLocation.lat && currentLocation.lon
        ? isFavorited(currentLocation.lat, currentLocation.lon)
        : false;

    const handleLocationSelect = (lat, lon) => {
        performSearch(`${lat},${lon}`);
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        const searchParam = selectedCoords
            ? `${selectedCoords.lat},${selectedCoords.lon}`
            : location;
        performSearch(searchParam);
    };

    const performSearch = async (searchParam) => {
        if (!searchParam) return;
        setError('');
        setLoading(true);
        geoSearchRef.current?.cancelPendingFetch();
        setGeoSearch(null);
        setLocation('');
        setSelectedCoords(null);
        try {
            const data = await fetchWeatherData(searchParam);
            if (data && data.weather && data.forecast) {
                updateWeather(data.weather, data.forecast, data.weather.lat, data.weather.lon);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            setError('Could not fetch weather data. Please check the location.');
            updateWeather(null, null, null, null);
            console.error('fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearchClick(e);
    };

    const toggleFavorite = () => {
        if (!currentLocation.lat || !currentLocation.lon) return;
        const cityName = currentWeather?.city || location;
        if (isFavorite) {
            removeFavorite(`${currentLocation.lat}-${currentLocation.lon}`);
        } else {
            addFavorite({ name: cityName, lat: currentLocation.lat, lon: currentLocation.lon });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 flex flex-col">
            <Header title="Search" showBackButton={false} />

            <main className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
                {/* Search input */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="relative shadow-xl">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    setSelectedCoords(null);
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Search by City or Lat,Lon"
                                className="w-full p-5 pr-14 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg bg-white shadow-lg"
                            />
                            <button
                                onClick={handleSearchClick}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl transition-all shadow-lg"
                            >
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="absolute w-full z-10 mt-2">
                            <GeoSearch
                                ref={geoSearchRef}
                                location={location}
                                setLocation={setLocation}
                                geoSearch={geoSearch}
                                setGeoSearch={setGeoSearch}
                                onLocationSelect={handleLocationSelect}
                            />
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {/* Spinner */}
                {loading && (
                    <Spinner />
                )}

                {/* Tabs + content */}
                {currentWeather && currentForecast && (
                    <>
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

                        {activeTab === 'current' ? (
                            <div className="mb-4">
                                <WeatherCard
                                    isFavorite={isFavorite}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </div>
                        ) : (
                            <Forecast forecastInfo={currentForecast} />
                        )}
                    </>
                )}
            </main>

            <NavBar currentPage="search" />
        </div>
    );
}

export default Search;