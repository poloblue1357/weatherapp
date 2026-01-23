// ORIGINAL CODE -- DO NOT DELETE

// import { useState } from 'react';
// import { XMLParser } from 'fast-xml-parser';

// const fetchWeatherData = async (location) => {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   let url;
//   if (location.includes(',')) {
//     const [lat, lon] = location.split(',');
//     url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}&mode=xml`;
//   } else {
//     url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}&mode=xml`;
//   }

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errText = await response.text();
//       console.error('API error response:', errText);
//       throw new Error(`HTTP ${response.status}: ${errText}`);
//     }

//     const xmlData = await response.text();
//     console.log('Raw XML:', xmlData);

//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: "",
//       attributesGroupName: "$",
//     });

//     const parsedData = parser.parse(xmlData);
//     console.log("Full parsed data:", parsedData);

//     return parsedData;
//   } catch (error) {
//     console.error('Fetch/parse failed:', error);
//     return null;
//   }
// };

// const fetchWindGustData = async (location) => {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   if (!apiKey) {
//     console.error('OpenWeather API key is missing');
//     return null;
//   }

//   let url;
//   if (location.includes(',')) {
//     const [lat, lon] = location.split(',');
//     url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}`;
//   } else {
//     url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
//   }

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       if (response.status === 404) {
//         console.warn('Location not found');
//       } else {
//         throw new Error(`HTTP error ${response.status}`);
//       }
//       return null;
//     }

//     const jsonData = await response.json();

//     // gust is optional → may be undefined even on 200 OK
//     return jsonData.wind?.gust ?? null;  // returns number (mph) or null
//   } catch (error) {
//     console.error('Error fetching wind gust data:', error);
//     return null;
//   }
// };

// function Search() {
//   const [weatherData, setWeatherData] = useState(null);
//   const [windGust, setWindGust] = useState(null);
//   const [location, setLocation] = useState('');
//   const [error, setError] = useState('');

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     // Fetch weather data from XML format
//     const data = await fetchWeatherData(location);
//     if (data) {
//       setWeatherData(data);
//     } else {
//       setError('Could not fetch weather data. Please check the location.');
//       return;
//     }

//     // Fetch wind gust data from JSON format
//     const gustData = await fetchWindGustData(location);
//     // console.log("Gust Data", gustData)
//     setWindGust(gustData);
//   };

//   const getWeatherInfo = (data) => {
//   if (!data || !data.current) {
//     // console.error("No weather data found");
//     return {};
//   }

//   const current = data.current;
//   const timezoneOffset = current.city?.timezone || 0; // Get the timezone offset (in seconds)

//   // Extract the sunrise, sunset, and lastupdate times and convert them
//   const sunriseUTC = current.city?.sun?.$.rise || null;
//   const sunsetUTC = current.city?.sun?.$.set || null;
//   const lastUpdateUTC = current.lastupdate?.$.value || null; // Extract last update time

// // ── Wind ────────────────────────────────────────
// const windSpeedObj = current.wind?.speed?.$ || {};
// const windSpeed = windSpeedObj.value ?? "N/A";
// const windType   = windSpeedObj.name  ?? "N/A";

// const windDirObj = current.wind?.direction?.$ || {};
// const windDirectionName = windDirObj.name ?? "N/A";
// const windDirectionCode = windDirObj.code ?? "N/A";

// // Prefer JSON gust (separate fetch) over XML
// const xmlGust = current.wind?.gusts?.$?.value ?? null;
// const finalWindGust = windGust ?? xmlGust ?? "N/A";  // windGust = state value from JSON

//   // Convert to Date objects
//   const sunriseDate = sunriseUTC ? new Date(sunriseUTC) : null;
//   const sunsetDate = sunsetUTC ? new Date(sunsetUTC) : null;
//   const lastUpdateDate = lastUpdateUTC ? new Date(lastUpdateUTC) : null; // Parse last update date

//   // Function to convert UTC time to local time using the timezone offset
//   const convertToLocalTime = (utcTime) => {
//     if (!utcTime) return "N/A";
//     const date = new Date(utcTime);
//     date.setSeconds(date.getSeconds() + timezoneOffset); // Adjust for the timezone offset
//     return date.toLocaleString(); // Returns the local time in a readable format
//   };

//   // Format the dates to a more readable format
//   const formattedSunrise = sunriseDate ? convertToLocalTime(sunriseDate) : "N/A";
//   const formattedSunset = sunsetDate ? convertToLocalTime(sunsetDate) : "N/A";
//   const formattedLastUpdate = lastUpdateDate ? convertToLocalTime(lastUpdateDate) : "N/A";

//   // Debugging logs
//   // console.log("Wind Data:", current.wind);
//   // console.log("Sunrise:", formattedSunrise, "Sunset:", formattedSunset);

// return {
//   city: current.city?.$.name || "Unknown City",
//   weather: current.weather?.$.value || "No weather data",
//   temperature: current.temperature?.$.value || "N/A",
//   humidity: current.humidity?.$.value || "N/A",
//   pressure: current.pressure?.$.value || "N/A",
  
//   windSpeed,
//   windType,
//   windDirection: windDirectionName,
//   windDirectionCode,
//   windGusts: finalWindGust === "N/A" ? "N/A" : finalWindGust,
  
//   sunrise: formattedSunrise,
//   sunset: formattedSunset,
//   lastUpdate: formattedLastUpdate,
// };
// };

//   const weatherInfo = getWeatherInfo(weatherData);

//   return (
//   <div className="flex justify-center pt-4 flex-col items-center">
//     {/* <h1 className="text-3xl font-bold mb-4">Weather App</h1> */}

//     {/* Search Bar */}
//     <form onSubmit={handleSearch} className="space-between">
//       <input
//         type="text"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         placeholder="Enter city or lat,lon"
//         className="p-2 border border-gray-300 rounded bg-blue-200"
//       />
//       <button type="submit" className="bg-blue-700 text-white p-2 rounded">
//         Search
//       </button>
//     </form>

//     {/* Display Weather Data or Error */}
//     {weatherData && weatherData.current ? (
//       <div className="weather-display p-4 mt-4 border rounded">
//         <h2 className="text-2xl font-bold">{weatherInfo.city}</h2>
//         <p className="text-xl">Weather: {weatherInfo.weather}</p>
//         <p>Temperature: {weatherInfo.temperature}°F</p>
//         <p>Humidity: {weatherInfo.humidity}%</p>
//         <p>Pressure: {weatherInfo.pressure} hPa</p>

//         {/* Wind Data */}
//         {weatherInfo.windSpeed !== "N/A" && (
//           <div>
//             <p>Wind Speed: {weatherInfo.windSpeed} mph</p>
//             <p>Wind Type: {weatherInfo.windType}</p>
//             <p>Wind Direction: {weatherInfo.windDirection} ({weatherInfo.windDirectionCode})</p>
//           </div>
//         )}

//         {/* Wind Gust Data */}
//         {weatherInfo.windGusts !== "N/A" && (
//           <div>
//             <p>Wind Gusts: {weatherInfo.windGusts} mph</p>
//           </div>
//         )}
        

//         {/* Sunrise and Sunset */}
//         <p>Sunrise: {weatherInfo.sunrise}</p>
//         <p>Sunset: {weatherInfo.sunset}</p>

//         {/* Last Updated */}
//         <p>Last Updated: {weatherInfo.lastUpdate}</p>
//       </div>
//     ) : null}

//     {/* Error Display */}
//     {error && <p className="text-red-500">{error}</p>}
//   </div>
// );

// }

// export default Search;

// ORIGINAL CODE -- DO NOT DELETE











// CLAUDE CODE - FIXING LAYOUT OF PAGE - DON'T DELETE

// import React, { useState, useEffect } from 'react';
// import { XMLParser } from 'fast-xml-parser';
// import { Search , Heart, Wind, Droplets, Gauge, Eye, Cloud, Sunrise, Sunset, MapPin, Plus, AlertCircle, Navigation, ArrowLeft, Home } from 'lucide-react';

// const fetchWeatherData = async (location) => {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   let url;
//   if (location.includes(',')) {
//     const [lat, lon] = location.split(',');
//     url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}&mode=xml`;
//   } else {
//     url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}&mode=xml`;
//   }

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errText = await response.text();
//       console.error('API error response:', errText);
//       throw new Error(`HTTP ${response.status}: ${errText}`);
//     }

//     const xmlData = await response.text();
//     console.log('Raw XML:', xmlData);

//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: "",
//       attributesGroupName: "$",
//     });

//     const parsedData = parser.parse(xmlData);
//     console.log("Full parsed data:", parsedData);

//     return parsedData;
//   } catch (error) {
//     console.error('Fetch/parse failed:', error);
//     return null;
//   }
// };

// const fetchWindGustData = async (location) => {
//   const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
//   if (!apiKey) {
//     console.error('OpenWeather API key is missing');
//     return null;
//   }

//   let url;
//   if (location.includes(',')) {
//     const [lat, lon] = location.split(',');
//     url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&units=imperial&appid=${apiKey}`;
//   } else {
//     url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${apiKey}`;
//   }

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       if (response.status === 404) {
//         console.warn('Location not found');
//       } else {
//         throw new Error(`HTTP error ${response.status}`);
//       }
//       return null;
//     }

//     const jsonData = await response.json();
//     return jsonData.wind?.gust ?? null;
//   } catch (error) {
//     console.error('Error fetching wind gust data:', error);
//     return null;
//   }
// };

// // Favorites management functions
// const getFavorites = () => {
//   const favorites = localStorage.getItem('weatherFavorites');
//   return favorites ? JSON.parse(favorites) : [];
// };

// const saveFavorites = (favorites) => {
//   localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
// };

// const addToFavorites = (location, city) => {
//   const favorites = getFavorites();
//   if (favorites.length >= 10) {
//     alert('Maximum of 10 favorites reached. Please remove one to add another.');
//     return false;
//   }
 
//   const exists = favorites.some(fav => fav.location === location);
//   if (exists) {
//     return false;
//   }
 
//   favorites.push({ location, city, addedAt: new Date().toISOString() });
//   saveFavorites(favorites);
//   return true;
// };

// const removeFromFavorites = (location) => {
//   const favorites = getFavorites();
//   const filtered = favorites.filter(fav => fav.location !== location);
//   saveFavorites(filtered);
// };

// const isInFavorites = (location) => {
//   const favorites = getFavorites();
//   return favorites.some(fav => fav.location === location);
// };

// function WeatherSearch({onNavigate}) {
//   const [weatherData, setWeatherData] = useState(null);
//   const [windGust, setWindGust] = useState(null);
//   const [location, setLocation] = useState('');
//   const [error, setError] = useState('');
//   const [isFavorite, setIsFavorite] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError('');
   
//     const data = await fetchWeatherData(location);
//     if (data) {
//       setWeatherData(data);
//       setIsFavorite(isInFavorites(location));
//     } else {
//       setError('Could not fetch weather data. Please check the location.');
//       return;
//     }

//     const gustData = await fetchWindGustData(location);
//     setWindGust(gustData);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch(e);
//     }
//   };

//   const toggleFavorite = () => {
//     const city = weatherData?.current?.city?.$.name || location;
   
//     if (isFavorite) {
//       removeFromFavorites(location);
//       setIsFavorite(false);
//     } else {
//       const success = addToFavorites(location, city);
//       if (success) {
//         setIsFavorite(true);
//       }
//     }
//   };

//   const getWeatherInfo = (data) => {
//     if (!data || !data.current) {
//       return {};
//     }

//     const current = data.current;
//     const timezoneOffset = current.city?.timezone || 0;

//     const sunriseUTC = current.city?.sun?.$.rise || null;
//     const sunsetUTC = current.city?.sun?.$.set || null;
//     const lastUpdateUTC = current.lastupdate?.$.value || null;

//     const windSpeedObj = current.wind?.speed?.$ || {};
//     const windSpeed = windSpeedObj.value ?? "N/A";
//     const windType = windSpeedObj.name ?? "N/A";

//     const windDirObj = current.wind?.direction?.$ || {};
//     const windDirectionName = windDirObj.name ?? "N/A";
//     const windDirectionCode = windDirObj.code ?? "N/A";
//     const windDirectionDegrees = windDirObj.value ?? null;

//     const xmlGust = current.wind?.gusts?.$?.value ?? null;
//     const finalWindGust = windGust ?? xmlGust ?? "N/A";

//     const formatTime = (utcTime) => {
//       if (!utcTime) return "N/A";
//       const date = new Date(utcTime);
//       date.setSeconds(date.getSeconds() + timezoneOffset);
//       return date.toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//       });
//     };

//     const getTimeAgo = (utcTime) => {
//       if (!utcTime) return "N/A";
//       const date = new Date(utcTime);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / 60000);
     
//       if (diffMins < 1) return "Just now";
//       if (diffMins === 1) return "1 minute ago";
//       if (diffMins < 60) return `${diffMins} minutes ago`;
     
//       const diffHours = Math.floor(diffMins / 60);
//       if (diffHours === 1) return "1 hour ago";
//       return `${diffHours} hours ago`;
//     };

//     return {
//       city: current.city?.$.name || "Unknown City",
//       weather: current.weather?.$.value || "No weather data",
//       temperature: current.temperature?.$.value || "N/A",
//       humidity: current.humidity?.$.value || "N/A",
//       pressure: current.pressure?.$.value || "N/A",
//       visibility: current.visibility?.$.value
//         ? (parseFloat(current.visibility.$.value) / 1609.34).toFixed(1) // meters to miles
//         : "N/A",
//       windSpeed,
//       windType,
//       windDirection: windDirectionName,
//       windDirectionCode,
//       windDirectionDegrees,
//       windGusts: finalWindGust === "N/A" ? "N/A" : finalWindGust,
//       sunrise: formatTime(sunriseUTC),
//       sunset: formatTime(sunsetUTC),
//       lastUpdate: getTimeAgo(lastUpdateUTC),
//     };
//   };

//   const getWindConditions = (windSpeed) => {
//     const speed = parseFloat(windSpeed);
   
//     if (isNaN(speed)) {
//       return { color: 'from-gray-500 to-gray-600', text: 'WIND DATA UNAVAILABLE' };
//     }
   
//     if (speed <= 4) {
//       return { color: 'from-green-500 to-emerald-600', text: 'GOOD CONDITIONS FOR JUMPING' };
//     } else if (speed === 5) {
//       return { color: 'from-amber-500 to-orange-600', text: 'PROCEED WITH CAUTION' };
//     } else {
//       return { color: 'from-red-500 to-rose-600', text: 'HIGH WINDS - EVALUATE ON SITE' };
//     }
//   };

//   const weatherInfo = getWeatherInfo(weatherData);
//   const windConditions = getWindConditions(weatherInfo.windSpeed);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
//       <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
//         <div className="flex items-center justify-between max-w-md mx-auto">
//           <button
//             onClick={() => onNavigate && onNavigate('home')}
//             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <h1 className="text-xl font-semibold tracking-wide">Jump Weather</h1>
//           <div className="w-10"></div>
//         </div>
//       </header>

//       <main className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
//         <div className="mb-6">
//           <div className="relative shadow-xl">
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Search any location..."
//               className="w-full p-5 pr-14 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg bg-white shadow-lg"
//             />
//             <button
//               onClick={handleSearch}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl transition-all shadow-lg"
//             >
//               <Search className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
//             {error}
//           </div>
//         )}

//         {weatherData && weatherData.current && (
//           <div className="space-y-4">
//             {/* Wind Condition Alert Banner */}
//             <div className={`bg-gradient-to-r ${windConditions.color} text-white p-5 rounded-2xl shadow-xl flex items-center justify-between`}>
//               <div>
//                 <div className="text-xs font-semibold opacity-90 mb-1 uppercase tracking-wide">Status</div>
//                 <div className="text-base font-bold leading-tight">{windConditions.text}</div>
//               </div>
//               <AlertCircle className="w-8 h-8 opacity-80 flex-shrink-0 ml-2" />
//             </div>

//             {/* Main Weather Card */}
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 text-white p-6 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
//                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
               
//                 <div className="relative flex items-start justify-between">
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <MapPin className="w-5 h-5" />
//                       <h2 className="text-2xl font-bold">{weatherInfo.city}</h2>
//                     </div>
//                     <p className="text-blue-100 text-base mb-4">{weatherInfo.weather}</p>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-5xl font-bold">{weatherInfo.temperature}</span>
//                       <span className="text-xl font-semibold">°F</span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={toggleFavorite}
//                     className="p-3 hover:bg-white/20 rounded-full transition-all"
//                   >
//                     <Heart
//                       className={`w-7 h-7 ${isFavorite ? 'fill-white' : ''}`}
//                       strokeWidth={2}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {/* Wind Compass */}
//               <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b">
//                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Wind Analysis</h3>
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <div className="relative w-28 h-28 mx-auto">
//                       <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full"></div>
//                       <div className="absolute inset-2 bg-white rounded-full shadow-inner"></div>
//                       {weatherInfo.windDirectionDegrees && (
//                         <div
//                           className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
//                           style={{ transform: `rotate(${weatherInfo.windDirectionDegrees}deg)` }}
//                         >
//                           <Navigation className="w-12 h-12 text-blue-600" fill="currentColor" />
//                         </div>
//                       )}
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-center mt-16">
//                           <div className="text-xs font-bold text-gray-500">{weatherInfo.windDirectionCode}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex-1 space-y-3">
//                     <div className="bg-blue-50 p-3 rounded-xl">
//                       <div className="text-xs text-gray-600 font-medium mb-1">Speed</div>
//                       <div className="text-xl font-bold text-blue-900">
//                         {weatherInfo.windSpeed} <span className="text-sm font-normal">mph</span>
//                       </div>
//                     </div>
//                     <div className="bg-amber-50 p-3 rounded-xl">
//                       <div className="text-xs text-gray-600 font-medium mb-1">Gusts</div>
//                       <div className="text-xl font-bold text-amber-900">
//                         {weatherInfo.windGusts !== "N/A"
//                           ? <>{weatherInfo.windGusts} <span className="text-sm font-normal">mph</span></>
//                           : <span className="text-sm">None</span>
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-3 text-center text-sm text-gray-600 font-medium">
//                   {weatherInfo.windType}
//                 </div>
//               </div>

//               {/* Weather Details */}
//               <div className="p-6 grid grid-cols-2 gap-4">
//                 <DetailCard
//                   icon={<Droplets className="w-5 h-5 text-blue-600" />}
//                   label="Humidity"
//                   value={`${weatherInfo.humidity}%`}
//                   color="blue"
//                 />
//                 <DetailCard
//                   icon={<Gauge className="w-5 h-5 text-purple-600" />}
//                   label="Pressure"
//                   value={`${weatherInfo.pressure} hPa`}
//                   color="purple"
//                 />
//                 <DetailCard
//                   icon={<Eye className="w-5 h-5 text-green-600" />}
//                   label="Visibility"
//                   value={`${weatherInfo.visibility} mi`}
//                   color="green"
//                 />
//                 <DetailCard
//                   icon={<Wind className="w-5 h-5 text-gray-600" />}
//                   label="Direction"
//                   value={weatherInfo.windDirection}
//                   color="gray"
//                 />
//               </div>

//               {/* Sun Times */}
//               <div className="px-6 pb-6 grid grid-cols-2 gap-4">
//                 <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
//                   <Sunrise className="w-6 h-6 text-orange-600 mb-2" />
//                   <div className="text-xs font-medium text-gray-600">Sunrise</div>
//                   <div className="text-base font-semibold text-orange-900">{weatherInfo.sunrise}</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
//                   <Sunset className="w-6 h-6 text-indigo-600 mb-2" />
//                   <div className="text-xs font-medium text-gray-600">Sunset</div>
//                   <div className="text-base font-semibold text-indigo-900">{weatherInfo.sunset}</div>
//                 </div>
//               </div>

//               {/* Last Updated */}
//               <div className="px-6 pb-4 text-center text-xs text-gray-500">
//                 Updated {weatherInfo.lastUpdate}
//               </div>

//               {/* Add/Remove Favorites Button */}
//               <div className="p-6 pt-0">
//                 <button
//                   onClick={toggleFavorite}
//                   className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
//                     isFavorite
//                       ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
//                       : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'
//                   }`}
//                 >
//                   {isFavorite ? (
//                     <>
//                       <Heart className="w-5 h-5 fill-white" />
//                       Remove from Favorites
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5" />
//                       Add to Favorites
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {onNavigate && (
//         <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl max-w-md mx-auto">
//           <div className="flex justify-around p-3">
//             <NavButton icon={<Home />} label="Home" onClick={() => onNavigate('home')} />
//             <NavButton icon={<Search />} label="Search" active />
//             <NavButton icon={<MapPin />} label="Exits" onClick={() => onNavigate('exits')} />
//             <NavButton icon={<Heart />} label="Favorites" onClick={() => onNavigate('favorites')} />
//           </div>
//         </nav>
//       )}
//     </div>
//   );
// }

// const DetailCard = ({ icon, label, value, color }) => {
//   const colorClasses = {
//     blue: 'bg-blue-50 border-blue-200',
//     purple: 'bg-purple-50 border-purple-200',
//     green: 'bg-green-50 border-green-200',
//     gray: 'bg-gray-50 border-gray-200'
//   };

//   return (
//     <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
//       <div className="flex items-center gap-2 mb-2">
//         {icon}
//         <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</span>
//       </div>
//       <p className="text-xl font-bold text-gray-900">{value}</p>
//     </div>
//   );
// };

// const NavButton = ({ icon, label, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
//       active
//         ? 'text-blue-600 bg-blue-50'
//         : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
//     }`}
//   >
//     {React.cloneElement(icon, { className: 'w-6 h-6', strokeWidth: 2 })}
//     <span className="text-xs font-bold">{label}</span>
//   </button>
// );

// export default WeatherSearch;

// CLAUDE CODE - FIXING LAYOUT OF PAGE -- DON'T DELETE UNTIL YOU'RE SURE THE NEW SEARCH WORKS!









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
      setWeatherData(data);
      const gustData = await fetchWindGustData(location);
      setWindGust(gustData);
     
      // Get formatted weather info
      const info = getWeatherInfo(data, gustData);
      setWeatherInfo(info);
     
      setIsFavorite(isInFavorites(location));
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
          <h1 className="text-xl font-semibold tracking-wide">Jump Weather</h1>
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

      
        {/* <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl max-w-md mx-auto">
          <div className="flex justify-around p-3">
            <NavButton icon={<Home />} label="Home" onClick={() => onNavigate('home')} />
            <NavButton icon={<SearchIcon />} label="Search" active />
            <NavButton icon={<MapPin />} label="Exits" onClick={() => onNavigate('exits')} />
            <NavButton icon={<Heart />} label="Favorites" onClick={() => onNavigate('favorites')} />
          </div>
        </nav> */}
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