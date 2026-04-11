import NavBar from "../components/NavBar";
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import ExitSubmit from "../components/ExitSubmit"
import { useState } from 'react'
import { fetchExitData } from "../api/exitAPI"

// upload new exits 
// input field + form for submitting new exit
// only need to save lat/lon and name on backend
// search bar - browse known exits
function Exits() {

    const [searchInput, setSearchInput] = useState('')
    const [testSearch, setTestSearch] = useState([])

    const handleChange = (e) => {
        const value = e.target.value
        setSearchInput(value)
    }
    const searchLocation = async (e, searchInput) => {
        e.preventDefault()
        setSearchInput('')
        try {
            const data = await fetchExitData(searchInput)
            if(data) {
                setTestSearch(data)
            } else {
                throw new Error('Invalid data format')
            }
        } catch (err) {
            console.error('fetch error: ', err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Dropzones and Exits" showBackButton={false} />
            <h1>TABS UP HERE - ABOVE THE SEARCH INPUT!</h1>
            <h1 className="m-5 text-white">Coming Soon!</h1>

            <form onSubmit={((e) => searchLocation(e, searchInput))}>
                <input 
                    style={{background: 'white', border: '1px solid black', margin: "10px", padding: '5px'}} 
                    placeholder="Search by DZ or Exit name" 
                    onChange={handleChange} 
                    value={searchInput}
                />
                <button
                    style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    
                >
                    Search
                </button>
            </form>
            <br />
            <br />

            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.name}</h1>
            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.lat}</h1>
            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.lon}</h1>

            <br />
            <br />

            <ExitSubmit />
            
            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits