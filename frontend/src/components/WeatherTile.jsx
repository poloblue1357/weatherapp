import WeatherCard from "./WeatherCard"
import { useState } from "react";
import { Plus } from "lucide-react";

function WeatherTile({ name, temp, desc }) {
    const [showCard, setShowCard] = useState(false);

    // Toggle for showing/hiding the detailed weather card
    const cardDisplay = () => {
        setShowCard(!showCard);
    };

    return (
        <div>
            <div
                className="mb-1 border-2 w-full h-14 flex flex-row items-center cursor-pointer"
                onClick={cardDisplay}
            >
                <div className="flex flex-row space-x-5 items-center w-full">
                    <Plus size={20} color="black" className="ml-2 mr-2" />
                    <p className="truncate flex-1 max-w-26">{name}</p>
                    <p className="max-w-6">
                        {temp}°
                        <span className="p-1 text-md">F</span>
                    </p>
                    <p className="truncate flex-1 ml-1 capitalize">{desc}</p>
                    </div>
                    <button className="text-sm w-[80px] bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold p-1 border-2 border-black mr-1 ml-2">
                        Remove
                    </button>
                </div>
            <div
                className={`transition-all duration-800 ease-in-out overflow-hidden ${
                showCard ? "opacity-100 max-h-screen visible" : "opacity-0 max-h-0 invisible"
                }`}
            >
                <div>TEST DIV FOR THE TOGGLE</div>
            </div>
        </div>
    );
}

export default WeatherTile;

