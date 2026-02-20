import { createContext, useState, useEffect } from "react"

export const AppContext = createContext()

export function AppProvider({children}) {
    // FAVORITES STATE (existing)
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('exitwx-favorites')
        return saved ? JSON.parse(saved) : []
    })

    // NEW: WEATHER STATE (for persistence across navigation)
    const [currentWeather, setCurrentWeather] = useState(null)
    const [currentForecast, setCurrentForecast] = useState(null)
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null })

    useEffect(() => {
        localStorage.setItem('exitwx-favorites', JSON.stringify(favorites))
    }, [favorites])

    // FAVORITES FUNCTIONS (existing)
    const addFavorite = (location) => {
        if (favorites.some(fav => fav.lat === location.lat && fav.lon === location.lon)) {
            return;
        }
        if (favorites.length >= 10) {
            alert('Maximum 10 favorites reached.')
            return;
        }
        const newFavorite = {
            id: `${location.lat}-${location.lon}`,
            name: location.name,
            lat: location.lat,
            lon: location.lon,
            addedAt: new Date().toISOString()
        }
        setFavorites(prev => [...prev, newFavorite])
    }

    const removeFavorite = (id) => {
        setFavorites(prev => prev.filter(fav => fav.id !== id))
    }

    const isFavorited = (lat, lon) => {
        return favorites.some(fav => fav.lat === lat && fav.lon === lon)
    }

    const updateFavoriteName = (id, newName) => {
        setFavorites(prev => prev.map(fav => fav.id === id ? {...fav, name: newName } : fav))
    }

    // NEW: WEATHER FUNCTIONS
    const updateWeather = (weather, forecast, lat, lon) => {
        setCurrentWeather(weather)
        setCurrentForecast(forecast)
        setCurrentLocation({ lat, lon })
    }

    const clearWeather = () => {
        setCurrentWeather(null)
        setCurrentForecast(null)
        setCurrentLocation({ lat: null, lon: null })
    }

    return (
        <AppContext.Provider value={{
            // Favorites
            favorites,
            addFavorite,
            removeFavorite,
            isFavorited,
            updateFavoriteName,
            // Weather
            currentWeather,
            currentForecast,
            currentLocation,
            updateWeather,
            clearWeather
        }}>
            {children}
        </AppContext.Provider>
    )
}