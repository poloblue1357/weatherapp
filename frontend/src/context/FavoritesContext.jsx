import { createContext, useState, useEffect } from "react"

export const FavoritesContext = createContext()

export function FavoritesProvider({children}) {

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('exitwx-favorites')
        return saved ? JSON.parse(saved) : []
    })
    useEffect(() => {
        localStorage.setItem('exitwx-favorites', JSON.stringify(favorites))
    }, [favorites])

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

    return (
        <FavoritesContext.Provider value={{
            favorites, 
            addFavorite,
            removeFavorite,
            isFavorited,
            updateFavoriteName
        }}>
            {children}
        </FavoritesContext.Provider>
    )
}

