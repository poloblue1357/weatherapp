import { Plus } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import WeatherCard from "./WeatherCard";
import Forecast from "./Forecast"; // Add this import
import { useState } from "react"

function WeatherTile({ id, weatherInfo, forecastInfo, expandedId, setExpandedId }) {
    const [activeTab, setActiveTab] = useState('current')
    const { removeFavorite } = useFavorites();

    const handleRemove = (e) => {
        e.stopPropagation();
        removeFavorite(id);
    };

    return (
        <div>
            <div
                className="mb-1 border-2 w-full h-14 flex flex-row items-center cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={() => {
                    setExpandedId(expandedId === id ? null : String(id))
                }}
            >
                <div className="flex flex-row items-center w-full">
                    <Plus
                        size={20}
                        color="black"
                        className={`shrink-0 ml-2 transition-transform ${expandedId === id ? 'rotate-45' : ''}`}
                    />
                    <p className="m-1 ml-1.5 truncate w-24 font-medium">{weatherInfo.city}</p>
                    <p className="m-2 shrink-0 w-7 font-bold text-lg">
                        {Math.round(weatherInfo.temp)}°
                    </p>
                    <p className="truncate w-23 capitalize text-gray-600">{weatherInfo.condition}</p>
                </div>
                <button
                    onClick={handleRemove}
                    className="text-sm w-20 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold p-2 rounded-lg mr-1 ml-2 flex items-center justify-center transition-all"
                >
                    Remove
                </button>
            </div>

            <div
                className={`transition-all duration-500 ease-in-out ${
                    expandedId === id ? "opacity-100 visible mb-4" : "opacity-0 max-h-0 invisible"
                }`}
            >
                {expandedId === id && weatherInfo && forecastInfo && (
                    <>
                        {/* Tab buttons */}
                        <div className="flex gap-3 mb-6 p-1 bg-white rounded-xl shadow-lg">
                            <button
                                onClick={() => setActiveTab('current')}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                                    activeTab === 'current'
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Current
                            </button>
                            <button
                                onClick={() => setActiveTab('forecast')}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                                    activeTab === 'forecast'
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Forecast
                            </button>
                        </div>

                        {/* Conditional rendering */}
                        {activeTab === 'current' ? (
                            <WeatherCard
                                weatherInfo={weatherInfo}
                                isFavorite={true}
                                onToggleFavorite={handleRemove}
                            />
                        ) : (
                            <Forecast forecastInfo={forecastInfo} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default WeatherTile;