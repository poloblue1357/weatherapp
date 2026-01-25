import WeatherTile from "../components/WeatherTile";
import NavBar from "../components/NavBar";
import axios from 'axios';
import { useState } from "react";

function Favorites() {
    const [locationsData, setLocationsData] = useState([]);

    // Fetch favorite locations
    function getFavs() {
        axios
        .get('http://localhost:8000/api/locations')
        .then((response) => {
            console.log('Data received:', response.data);
            setLocationsData(response.data);
        })
        .catch((error) => {
            console.error('There was an error with the axios request:', error);
        });
    }

    const lData = locationsData.map((location) => {
        const weather = location?.weather || {}; // Default to an empty object if weather is undefined

        // Extract and convert temperature to a number
        const temperatureString = weather.temperature;
        const temp = temperatureString ? parseFloat(temperatureString.replace('°F', '').trim()) : NaN; // Remove "°F" and convert to number

        // Check if the temp is valid (not NaN)
        const lTemp = Number.isNaN(temp) ? 69 : Math.round(temp); // Defaults to 69 if temperature is invalid

        return {
            lName: location?.name,
            lTemp: lTemp, // Use the validated temperature
            lDesc: weather.description || "Cloudy", // Defaults to "Cloudy" if description is missing
        };
    });



    return (
        <div>
        <h1>Favorites</h1>
        <button onClick={getFavs} className="border-2 p-2 m-2">
            Get Favs
        </button>

        {/* Pass the mapped data to WeatherTile */}
        <div>
            {lData.map((location, index) => (
            <WeatherTile
                key={index} // Use a unique key for each WeatherTile
                name={location.lName}
                temp={location.lTemp}
                desc={location.lDesc}
            />
            ))}
        </div>

        <NavBar />
        </div>
    );
}

export default Favorites;
