// import { Link } from "react-router-dom";

// function Home() {
//     return (
//         <div className="flex flex-col max-w-2xl mx-auto p-6 space-y-4 justify-center items-center">
//             <h1 className="text-2xl font-bold">
//                 Weather Conditions for Paragliding and BASE Jumping
//             </h1>

//             <p className="text-lg">
//                 This app helps BASE jumpers and paragliders check weather conditions
//                 at known exits and any location worldwide. Save your favorite locations,
//                 track wind and conditions, and quickly decide when and where to fly or jump.
//             </p>

//             <div className="flex gap-7 pt-4">
//                 <Link to="/search" className="underline outline-2 p-3 rounded-2xl">
//                     Search Weather
//                 </Link>
//                 <Link to="/favorites" className="underline outline-2 p-3 rounded-2xl">
//                     View Favorites
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default Home;

// old code - don't delete




import { Link } from "react-router-dom";
import { Search, Heart, Wind, AlertCircle, MapPin } from 'lucide-react';

function Home() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-700 to-sky-500">
        <header className="bg-black/20 backdrop-blur-sm text-white p-4 shadow-lg">
            <h1 className="text-xl font-semibold text-center tracking-wide">Jump Weather</h1>
        </header>

        <main className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
            <div className="text-center mb-12">
            <div className="relative mb-6">
                <div className="w-40 h-40 bg-linear-to-br from-white/30 to-white/10 backdrop-blur-md rounded-full mx-auto flex items-center justify-center border-4 border-white/50 shadow-2xl">
                <Wind className="w-20 h-20 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                LIVE CONDITIONS
                </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Ready to Jump?</h2>
            <p className="text-blue-100 max-w-sm mx-auto leading-relaxed text-base px-4">
                Real-time weather for base jumpers and paragliders. Verify conditions at exits and any location worldwide.
            </p>
            </div>

            <div className="space-y-4 w-full max-w-sm px-4">
                <Link
                    to="/search"
                    className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-between group"
                >
                    <span className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                        <Search className="w-5 h-5 text-white" />
                    </div>
                    Search Locations
                    </span>
                    <span className="text-2xl">→</span>
                </Link>
                
                <Link
                    to="/exits"
                    className="w-full bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-between group"
                >
                    <span className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Known Exits
                    </span>
                    <span className="text-2xl">→</span>
                </Link>
                
                <Link
                    to="/favorites"
                    className="w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-between group"
                >
                    <span className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    My Favorites
                    </span>
                    <span className="text-2xl">→</span>
                </Link>
            </div>
        </main>
        </div>
    );
}

export default Home;
