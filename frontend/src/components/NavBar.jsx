// import { Link } from 'react-router-dom';

// function NavBar() {

//     return (
//     <nav className="flex justify-around items-center p-3">
//         <Link 
//             className="border-2 p-3 rounded-md"
//             to="/"
//         >
//             Home
//         </Link>
//         <Link 
//             className="border-2 p-3 rounded-md"
//             to="/search"
//         >
//             WeatherSearch
//         </Link>
//         <Link 
//             className="border-2 p-3 rounded-md"
//             to="/exits"
//         >
//             Exits
//         </Link>
//         <Link 
//             className="border-2 p-3 rounded-md"
//             to="/favorites"
//         >
//             Favorites
//         </Link>
//     </nav>
//     )
// }

// export default NavBar

// old code - don't delete


import React from "react"
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MapPin, Heart } from 'lucide-react';

function NavBar({ currentPage }) {
    const location = useLocation();
    const current = currentPage || location.pathname.slice(1) || 'home';

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl max-w-md mx-auto">
        <div className="flex justify-around p-3">
            <NavButton
            to="/"
            icon={<Home />}
            label="Home"
            active={current === '' || current === 'home'}
            />
            <NavButton
            to="/search"
            icon={<Search />}
            label="Search"
            active={current === 'search'}
            />
            <NavButton
            to="/exits"
            icon={<MapPin />}
            label="Exits"
            active={current === 'exits'}
            />
            <NavButton
            to="/favorites"
            icon={<Heart />}
            label="Favorites"
            active={current === 'favorites'}
            />
        </div>
        </nav>
    );
}

const NavButton = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
        active
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
        }`}
    >
        {React.cloneElement(icon, { className: 'w-6 h-6', strokeWidth: 2 })}
        <span className="text-xs font-bold">{label}</span>
    </Link>
);

export default NavBar;