import { Link } from "react-router-dom";
import { Search, Heart, Wind, MapPin } from 'lucide-react';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
        <header className="bg-black/20 backdrop-blur-sm text-white p-4 shadow-lg">
            <h1 className="text-xl font-semibold text-center tracking-wide">ExitWx</h1>
            <p className="text-center text-blue-100 text-sm mt-1 font-light tracking-wider">
            Wind & Weather for Jumpers
            </p>
        </header>

        <main className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
            <div className="text-center mb-12">
            <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-full mx-auto flex items-center justify-center border-4 border-white/50 shadow-2xl">
                <Wind className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                LIVE CONDITIONS
                </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-3">Ready to Jump?</h2>
            <p className="text-blue-100 max-w-sm mx-auto leading-relaxed text-base px-4">
                Check the weather at your favorite spots — made for sky and BASE jumpers.
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
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-between group"
            >
                <span className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                Known Exits
                </span>
                <span className="text-2xl">→</span>
            </Link>

            <Link
                to="/favorites"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center justify-between group"
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