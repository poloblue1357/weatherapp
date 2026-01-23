import { Link } from 'react-router-dom';

function NavBar() {

    return (
    <nav className="flex justify-around items-center p-3">
        <Link 
            className="border-2 p-3 rounded-md"
            to="/"
        >
            Home
        </Link>
        <Link 
            className="border-2 p-3 rounded-md"
            to="/search"
        >
            WeatherSearch
        </Link>
        <Link 
            className="border-2 p-3 rounded-md"
            to="/exits"
        >
            Exits
        </Link>
        <Link 
            className="border-2 p-3 rounded-md"
            to="/favorites"
        >
            Favorites
        </Link>
    </nav>
    )
}

export default NavBar