import NavBar from "../components/NavBar";
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import { useState } from 'react'
// upload new exits 
// input field + form for submitting new exit
// only need to save lat/lon and name on backend
// search bar - browse known exits
function Exits() {

    const [searchInput, setSearchInput] = useState('')
    const [showForm, setShowForm] = useState(false)

    const handleChange = (e) => {
        const value = e.target.value
        setSearchInput(value)
        console.log(searchInput)
    }
    const search = () => {
        console.log('Search Input: ', searchInput)
    }
    const changeShowForm = () => {
        setShowForm(prev => !prev)
        console.log(showForm)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Dropzones and Exits" showBackButton={false} />
            <h1 className="m-5 text-white">Coming Soon!</h1>

            <input 
                style={{background: 'white', border: '1px solid black', margin: "10px", padding: '5px'}} 
                placeholder="Search by DZ or Exit name" 
                onChange={handleChange} 
                value={searchInput}
            >
            </input>
            <button
                style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                onSubmit={search}
            >Search
            </button>
            <br />
            <br />
            <button
                style={{background: 'white', border: '1px solid black', margin: "10px", padding: '5px', width: '145px'}}
                onClick={changeShowForm}
            >{showForm ? 'Hide Form' : 'Submit a New Exit'}
            </button>
            {showForm && 
                <form>
                    <input 
                        placeholder="Exit Name"
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    ></input>
                    <input 
                        placeholder="Latitude"
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    ></input>
                    <input 
                        placeholder="Longitude"
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    ></input>
                    <button
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    >Submit</button>
                </form>
            }
            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits