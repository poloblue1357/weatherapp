import NavBar from "../components/NavBar";
import Header from "../components/Header"
import WeatherTile from "../components/WeatherTile";
import GeoSearch from "../components/GeoSearch"
// upload new exits 
// local storage with a way to add/remove
// limit to 8 exits in favorites
// input field + form for submitting new exit
// only need to save lat/lon and name on backend
// drag/rearrange exits? favorites?
// search bar - browse known exits
function Exits() {



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Known Exits" showBackButton={false} />
            <h1 className="m-5 text-white">Coming Soon!</h1>

            {/* local storage, tiles, basically like the favorites page */}


            {/* form, button, title, state, get request */}
            {/* <form>
                <input 
                    className="w-64 p-2 rounded-lg border border-gray-300 text-black bg-white" 
                    type='text' 
                    name='exitSearch' 
                />
                <button 
                    className="px-4 py-2 bg-white text-blue-700 font-bold rounded-lg"
                >Search Exits</button>
            </form> */}

            {/* form, submit button to database or email? both? title, button */}

            {/* <GeoSearch /> */}
            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits