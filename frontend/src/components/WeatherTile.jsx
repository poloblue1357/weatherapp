import NavBar from "./NavBar"
import WeatherCard from "./WeatherCard"
import { useState } from "react"
import { Plus } from 'lucide-react'

function WeatherTile() {
    const [showCard, setShowCard] = useState(false)

    const cardDisplay = () => {
        setShowCard(!showCard)
    }

    return (
        <div>
            <div 
                className="border-2 w-full h-14 flex flex-row items-center cursor-pointer justify-between" 
                onClick={cardDisplay}
            >
                <div className="flex flex-row space-x-5 items-center w-full">
                    <Plus size={24} color="black" className="ml-3"/>
                    <p className="truncate flex-1 max-w-25">Salt Lake City salt lake city</p>
                    <p>47<span className="px-1 text-md">°F</span></p>
                    <p>Cloudy</p>
                </div>
                <button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold p-1 border-2 border-black mr-1 ml-2"
                
                >
                    Remove
                </button>
            </div>
            <div
                className={`transition-all duration-1000 ease-in-out overflow-hidden ${showCard ? 'opacity-100 max-h-screen visible' : 'opacity-0 max-h-0 invisible'}`}
            >
                <div>THIS IS A TEST DIV TO SEE IF THE TOGGLE WORKS!</div>
            </div>

            <NavBar />
        </div>
    )
}

export default WeatherTile
