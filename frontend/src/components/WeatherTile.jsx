import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import WeatherCard from "./WeatherCard";

function WeatherTile({ id, name, temp, desc, weatherInfo, expandedId, setExpandedId }) {
    const [showCard, setShowCard] = useState(false);
    const { removeFavorite } = useFavorites();

    // Toggle for showing/hiding the detailed weather card
    {/*const cardDisplay = () => {
        setShowCard(!showCard);
    };*/}

    const handleRemove = (e) => {
        e.stopPropagation(); // Prevent triggering cardDisplay
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
                        className={`shrink-0 ml-2 ${showCard ? 'rotate-45' : ''}`}
                    />
                    <p className="m-1 ml-1.5 truncate w-26 font-medium">{name}</p>
                    <p className="m-2 shrink-0 w-7 font-bold text-lg">
                        {Math.round(temp)}°
                        <span className="p-1 text-md font-normal"></span>
                    </p>
                    <p className="truncate w-22 capitalize text-gray-600">{desc}</p>
                </div>
                <button
                    onClick={handleRemove}
                    className="text-sm w-[80px] bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold p-2 rounded-lg mr-2 ml-2 flex items-center justify-center gap-1 transition-all"
                >
                    {/* <X size={16} /> */}
                    Remove
                </button>
            </div>
           
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedId === id ? "opacity-100 max-h-screen visible mb-4" : "opacity-0 max-h-0 invisible"
                }`}
            >
            {expandedId === id && <WeatherCard weatherInfo={weatherInfo} />}
                {/* 
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-2">
                    <p className="text-gray-700">Detailed weather card will go here...</p>
                    <p className="text-sm text-gray-500 mt-2">This will show the full WeatherCard component</p> 
                    
                </div>
                */}
            </div>
        </div>
    );
}

export default WeatherTile;

