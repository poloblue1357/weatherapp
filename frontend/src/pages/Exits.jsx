import NavBar from "../components/NavBar";
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
// upload new exits 
// limit to 10 exits in favorites
// input field + form for submitting new exit
// only need to save lat/lon and name on backend
// search bar - browse known exits
function Exits() {



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Known Exits" showBackButton={false} />
            <h1 className="m-5 text-white">Coming Soon!</h1>



            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits