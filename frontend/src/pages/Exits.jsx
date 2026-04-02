import NavBar from "../components/NavBar";
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import { useState } from 'react'
import { fetchExitData, postExitData } from "../api/exitAPI"
// upload new exits 
// input field + form for submitting new exit
// only need to save lat/lon and name on backend
// search bar - browse known exits
function Exits() {

    const [searchInput, setSearchInput] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [testSearch, setTestSearch] = useState([])
    const [visible, setVisible] = useState('')
    const [fading, setFading] = useState('')
    const [error, setError] = useState()
    const [data, setData] = useState()
    const [formData, setFormData] = useState({
        telephone: '', // 
        website: '', // 
        city: '', // 
        country: '', //
        lat: '', // 
        lon: '', // 
        name: '', // 
        email: '', // 
        zip: '', // 
        state: '', // 
        source: 'user',
    });

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
    const changeShowForm = () => {
        setShowForm(prev => !prev)
        // console.log(showForm)
    }
    
    const handleForm = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({...prev, [name]: value}))
    }
    const formSubmit = async(e) => {
        e.preventDefault()
        try {
            await postExitData(formData)


            setVisible(true);
            setFading(false);
    
            setTimeout(() => {
                setFading(true); // start fade
            }, 4000);
    
            setTimeout(() => {
                setVisible(false); // remove after fade
            }, 5000);
        }
        catch (error) {

        }
    }
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Dropzones and Exits" showBackButton={false} />
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
                >Search</button>
            </form>
            <br />
            <br />

            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.name}</h1>
            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.lat}</h1>
            <h1 style={{color: 'white', margin: '10px', padding: '10px'}}>{testSearch[0]?.lon}</h1>

            <br />
            <br />
            {/* exit / dz input form  */}
            <button
                style={{background: 'white', border: '1px solid black', margin: "10px", padding: '5px', width: '145px'}}
                onClick={changeShowForm}
            >{showForm ? 'Hide' : 'Submit a DZ / Exit'}</button>
            <span style={{color: 'white'}}>* required fields</span>
            <span style={{color: 'red', fontSize: '14px'}}>{error ? error : ''}</span>
            {showForm && 
                <form 
                    onSubmit={formSubmit}
                    style={{paddingBottom: '0px'}}
                >
                    <input 
                        placeholder="* DZ / Exit Name"
                        name='name'
                        value={formData.name}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="* Latitude"
                        name='lat'
                        value={formData.lat}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="* Longitude"
                        name='lon'
                        value={formData.lon}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="City"
                        name='city'
                        value={formData.city}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="State / Province"
                        name='state'
                        value={formData.state}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Country"
                        name='country'
                        value={formData.country}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Postal Code"
                        name='zip'
                        value={formData.zip}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Email"
                        name='email'
                        value={formData.email}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Website"
                        name='website'
                        value={formData.website}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Telephone"
                        name='telephone'
                        value={formData.telephone}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <button
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                        type="submit"
                    >Submit the DZ / Exit Information</button>
                    {/* notice the submission was received + fading out */}
                    {visible && !error && (
                        <div style={{opacity: fading ? 0 : 1, transition: "opacity 1s ease", color: 'white', fontSize: '14px'}}>
                            Submission received!
                        </div>
                    )}
                </form>
            }
            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits