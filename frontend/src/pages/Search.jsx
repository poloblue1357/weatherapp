import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { fetchWeatherData } from '../api/weatherAPI';
import WeatherCard from '../components/WeatherCard';
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useFavorites } from '../hooks/useFavorites';
import Forecast from '../components/Forecast';

function Search() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [forecastInfo, setForecastInfo] = useState(null)
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [activeTab, setActiveTab] = useState('current')

  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  // Check if current location is favorited
  const isFavorite = currentLat && currentLon ? isFavorited(currentLat, currentLon) : false;

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    const data = await fetchWeatherData(location);
    if (data && data.weather && data.forecast) {
      setWeatherInfo(data.weather);
      setForecastInfo(data.forecast || null)

      // Extract lat/lon from the weatherInfo
      setCurrentLat(data.weather.lat);
      setCurrentLon(data.weather.lon);
      setLocation('');
    } else {
      setError('Could not fetch weather data. Please check the location.');
      setWeatherInfo(null);
      setForecastInfo(null);
      setCurrentLat(null);
      setCurrentLon(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleFavorite = () => {
    if (!currentLat || !currentLon) return;

    const cityName = weatherInfo?.city || location;

    if (isFavorite) {
      const favoriteId = `${currentLat}-${currentLon}`;
      removeFavorite(favoriteId);
    } else {
      addFavorite({
        name: cityName,
        lat: currentLat,
        lon: currentLon
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 flex flex-col">
      <Header title="Search" showBackButton={false} />

      <main className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
        <div className="mb-6">
          <div className="relative shadow-xl">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}
        {weatherInfo && forecastInfo && (
          <>
          <div className='flex gap-3 mb-6 p-1 bg-white rounded-xl shadow-lg'>
            <button 
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all 
                        ${activeTab === 'current' 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Current
            </button>
            <button 
              onClick={() => setActiveTab('forecast')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all 
                        ${activeTab === 'forecast'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Forecast
            </button>
          </div>  
          {activeTab === 'current' ? (
            <div className="mb-4">
              <WeatherCard
                weatherInfo={weatherInfo}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ) : (
            <Forecast forecastInfo={forecastInfo} />
          )}
          </>
        )}
      </main>
      <NavBar currentPage="search" />
    </div>
  );
}

export default Search;