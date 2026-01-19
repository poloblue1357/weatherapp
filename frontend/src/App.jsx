import React, { useState } from 'react';
import './index.css';
import { XMLParser } from 'fast-xml-parser';

const fetchWeatherData = async (location) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  let url;
  if (location.includes(',')) {
    const [lat, lon] = location.split(',');
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}&mode=xml`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}&mode=xml`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      console.error('API error response:', errText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const xmlData = await response.text();
    console.log('Raw XML:', xmlData);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      attributesGroupName: "$",
    });

    const parsedData = parser.parse(xmlData);
    console.log("Full parsed data:", parsedData);

    return parsedData;
  } catch (error) {
    console.error('Fetch/parse failed:', error);
    return null;
  }
};

const fetchWindGustData = async (location) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('OpenWeather API key is missing');
    return null;
  }

  let url;
  if (location.includes(',')) {
    const [lat, lon] = location.split(',');
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Location not found');
      } else {
        throw new Error(`HTTP error ${response.status}`);
      }
      return null;
    }

    const jsonData = await response.json();

    // gust is optional → may be undefined even on 200 OK
    return jsonData.wind?.gust ?? null;  // returns number (mph) or null
  } catch (error) {
    console.error('Error fetching wind gust data:', error);
    return null;
  }
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [windGust, setWindGust] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    // Fetch weather data from XML format
    const data = await fetchWeatherData(location);
    if (data) {
      setWeatherData(data);
    } else {
      setError('Could not fetch weather data. Please check the location.');
      return;
    }

    // Fetch wind gust data from JSON format
    const gustData = await fetchWindGustData(location);
    console.log("Gust Data", gustData)
    setWindGust(gustData);
  };

  const getWeatherInfo = (data) => {
  if (!data || !data.current) {
    return {};
  }

  const current = data.current;
  const timezoneOffset = current.city?.timezone || 0; // Get the timezone offset (in seconds)

  // Extract the sunrise, sunset, and lastupdate times and convert them
  const sunriseUTC = current.city?.sun?.$.rise || null;
  const sunsetUTC = current.city?.sun?.$.set || null;
  const lastUpdateUTC = current.lastupdate?.$.value || null; // Extract last update time

  const gusts = windGust || "N/A"; // Use the state value of wind gusts
  const speed = current.wind?.speed?.$.value || "N/A"; // Corrected this line

  // Convert to Date objects
  const sunriseDate = sunriseUTC ? new Date(sunriseUTC) : null;
  const sunsetDate = sunsetUTC ? new Date(sunsetUTC) : null;
  const lastUpdateDate = lastUpdateUTC ? new Date(lastUpdateUTC) : null; // Parse last update date

  // Function to convert UTC time to local time using the timezone offset
  const convertToLocalTime = (utcTime) => {
    if (!utcTime) return "N/A";
    const date = new Date(utcTime);
    date.setSeconds(date.getSeconds() + timezoneOffset); // Adjust for the timezone offset
    return date.toLocaleString(); // Returns the local time in a readable format
  };

  // Format the dates to a more readable format
  const formattedSunrise = sunriseDate ? convertToLocalTime(sunriseDate) : "N/A";
  const formattedSunset = sunsetDate ? convertToLocalTime(sunsetDate) : "N/A";
  const formattedLastUpdate = lastUpdateDate ? convertToLocalTime(lastUpdateDate) : "N/A";

  // console.log("Last update", formattedLastUpdate)
  return {
    city: current.city?.$.name || "Unknown City",
    weather: current.weather?.$.value || "No weather data",
    temperature: current.temperature?.$.value || "N/A",
    humidity: current.humidity?.$.value || "N/A",
    pressure: current.pressure?.$.value || "N/A",
    windSpeed: speed, // Wind speed from XML
    windType: current.wind?.speed?.$.name || "N/A",
    windDirection: current.wind?.direction?.$.name || "N/A",
    windDirectionCode: current.wind?.direction?.$.code || "N/A",
    windGusts: gusts, // Wind gusts from JSON
    sunrise: formattedSunrise,
    sunset: formattedSunset,
    lastUpdate: formattedLastUpdate, // Add formatted last update here
  };
};

  const weatherInfo = getWeatherInfo(weatherData);

  return (
  <div className="App p-4">
    <h1 className="text-3xl font-bold mb-4">Weather App</h1>

    {/* Search Bar */}
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter city or lat,lon"
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
    </form>

    {/* Display Weather Data or Error */}
    {weatherData && weatherData.current ? (
      <div className="weather-display p-4 mt-4 border rounded">
        <h2 className="text-2xl font-bold">{weatherInfo.city}</h2>
        <p className="text-xl">Weather: {weatherInfo.weather}</p>
        <p>Temperature: {weatherInfo.temperature}°F</p>
        <p>Humidity: {weatherInfo.humidity}%</p>
        <p>Pressure: {weatherInfo.pressure} hPa</p>

        {/* Wind Data */}
        {weatherInfo.windSpeed !== "N/A" && (
          <div>
            <p>Wind Speed: {weatherInfo.windSpeed} mph</p>
            <p>Wind Type: {weatherInfo.windType}</p>
            <p>Wind Direction: {weatherInfo.windDirection} ({weatherInfo.windDirectionCode})</p>
          </div>
        )}

        {/* Wind Gust Data */}
        {weatherInfo.windGusts !== "N/A" && (
          <div>
            <p>Wind Gusts: {weatherInfo.windGusts} mph</p>
          </div>
        )}
        

        {/* Sunrise and Sunset */}
        <p>Sunrise: {weatherInfo.sunrise}</p>
        <p>Sunset: {weatherInfo.sunset}</p>

        {/* Last Updated */}
        <p>Last Updated: {weatherInfo.lastUpdate}</p>
      </div>
    ) : null}

    {/* Error Display */}
    {error && <p className="text-red-500">{error}</p>}
  </div>
);

}

export default App;
