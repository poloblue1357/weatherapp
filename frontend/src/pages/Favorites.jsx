import WeatherTile from "../components/WeatherTile"
import NavBar from "../components/NavBar"
// up to 10 locations saved in local storage
function Favorites() {

    return (
        <div>
            Favorites

            <WeatherTile />

            <NavBar />
        </div>
    )
}

export default Favorites