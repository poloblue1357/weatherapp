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

function Search() {
  // LOCAL UI STATE (stays here)
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [geoSearch, setGeoSearch] = useState(null);
  const geoSearchRef = useRef();
  const [selectedCoords, setSelectedCoords] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
 
  // GET FROM CONTEXT
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
    const coords = { lat, lon };
    setSelectedCoords(coords);
    handleSearch(null, coords);
  };

  const handleSearch = async (e, coordsOverride) => {
    e?.preventDefault();
    setError('');
    setLoading(true)

    const coordsToUse = coordsOverride || selectedCoords
   
    const searchParam = selectedCoords
      ? `${coordsToUse.lat},${coordsToUse.lon}`
      : location;
   
    geoSearchRef.current?.cancelPendingFetch();
    setGeoSearch(null);
    setLocation('')
    setSelectedCoords(null)

    try {
        const data = await fetchWeatherData(searchParam);
        if (data && data.weather && data.forecast) {
          // UPDATE CONTEXT instead of local state
          updateWeather(data.weather, data.forecast, data.weather.lat, data.weather.lon);
        } else {
          throw new Error(`Invalid data format`)
        }
      } catch (err) {
          setError('Could not fetch weather data. Please check the location.');
          updateWeather(null, null, null, null);
          console.error(`fetch error:`, err)
      } finally {
        setLoading(false)
      }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleFavorite = () => {
    if (!currentLocation.lat || !currentLocation.lon) return;
    const cityName = currentWeather?.city || location;
   
    if (isFavorite) {
      const favoriteId = `${currentLocation.lat}-${currentLocation.lon}`;
      removeFavorite(favoriteId);
    } else {
      addFavorite({
        name: cityName,
        lat: currentLocation.lat,
        lon: currentLocation.lon
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 flex flex-col">
      <Header title="Search" showBackButton={false} />

      <main className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
        <div className="mb-6">
          <div className="relative">
            <div className="relative shadow-xl">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setSelectedCoords(null)
                }}
                onKeyPress={handleKeyPress}
                placeholder="Search by City / Zip / Lat,Lon"
                className="w-full p-5 pr-14 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg bg-white shadow-lg"
              />
              <button
                onClick={handleSearch}
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center space-x-2 mt-10 mb-10">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-indigo-600"></div>
          </div>
        )}

        {currentWeather && currentForecast && (
          <>
            <div className='flex gap-3 mb-6 p-1 bg-white rounded-xl shadow-lg'>
              <button
                  onClick={() => setActiveTab('current')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                      activeTab === 'current'
                          ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                  Current
              </button>
              <button
                  onClick={() => setActiveTab('forecast')}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                      activeTab === 'forecast'
                          ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                  Forecast
              </button>
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