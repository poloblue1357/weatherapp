import React, { useState } from 'react';
import { Search as SearchIcon, Heart, Home, MapPin, ArrowLeft } from 'lucide-react';
import { fetchWeatherData, fetchWindGustData, getWeatherInfo } from '../api/weatherAPI';
import WeatherCard from '../components/WeatherCard';
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

// Favorites management functions
const getFavorites = () => {
  const favorites = localStorage.getItem('weatherFavorites');
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
};

const addToFavorites = (location, city) => {
  const favorites = getFavorites();
  if (favorites.length >= 10) {
    alert('Maximum of 10 favorites reached. Please remove one to add another.');
    return false;
  }
 
  const exists = favorites.some(fav => fav.location === location);
  if (exists) {
    return false;
  }
 
  favorites.push({ location, city, addedAt: new Date().toISOString() });
  saveFavorites(favorites);
  return true;
};

const removeFromFavorites = (location) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(fav => fav.location !== location);
  saveFavorites(filtered);
};

const isInFavorites = (location) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.location === location);
};

function Search() {
  const [weatherData, setWeatherData] = useState(null);
  const [windGust, setWindGust] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
   
    const data = await fetchWeatherData(location);
    if (data) {
      console.log("data:", data)
      setWeatherData(data);
      const gustData = await fetchWindGustData(location);
      setWindGust(gustData);
     
      // Get formatted weather info
      const info = getWeatherInfo(data, gustData);
      setWeatherInfo(info);
     
      setIsFavorite(isInFavorites(location));
      setLocation('')
    } else {
      setError('Could not fetch weather data. Please check the location.');
      setWeatherInfo(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleFavorite = () => {
    const city = weatherData?.current?.city?.$.name || location;
   
    if (isFavorite) {
      removeFromFavorites(location);
      setIsFavorite(false);
    } else {
      const success = addToFavorites(location, city);
      if (success) {
        setIsFavorite(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold tracking-wide">ExitWx</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
        <div className="mb-6">
          <div className="relative shadow-xl">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search any location..."
              className="w-full p-5 pr-14 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg bg-white shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl transition-all shadow-lg"
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

        {weatherInfo && (
          <WeatherCard
            weatherInfo={weatherInfo}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
      <NavBar currentPage="search" />
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
      active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-6 h-6', strokeWidth: 2 })}
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default Search;