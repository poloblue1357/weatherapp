import WeatherTile from "../components/WeatherTile";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useContext, useEffect } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchWeatherData } from "../api/weatherAPI";

function Favorites() {
    const { favorites } = useContext(FavoritesContext);

    const [results, setResults] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchAllWeather = async () => {
            const weatherResults = [];

            for (const fav of favorites) {
                try {
                    const location = `${fav.lat},${fav.lon}`;
                    const data = await fetchWeatherData(location);

                    weatherResults.push({
                        id: String(fav.id),
                        name: fav.name,
                        weatherInfo: data.weather
                    });
                } catch (error) {
                    console.error(`Failed to fetch weather for ${fav.name}:`, error);
                }
            }
            setResults(weatherResults);
        };
        if (favorites.length > 0) {
            fetchAllWeather();
        } else {
            setResults([]); // Clear results if no favorites
        }
    }, [favorites]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="My Favorites" showBackButton={false} />

            <main className="p-4 pb-20 max-w-md mx-auto">
                {favorites.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white text-3xl font-semibold">No favorites yet</p>
                        <p className="text-blue-100 text-xl mt-2">
                            Add locations <span className="text-purple-300">from</span> the Search page!
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    {results.map((favoriteLocation) => (
                        <WeatherTile
                            key={favoriteLocation.id}
                            id={favoriteLocation.id}
                            weatherInfo={favoriteLocation.weatherInfo}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                        />
                    ))}
                </div>
            </main>

            <NavBar currentPage="favorites" />
        </div>
    );
}

export default Favorites;