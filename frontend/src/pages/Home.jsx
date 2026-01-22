import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="flex flex-col max-w-2xl mx-auto p-6 space-y-4 justify-center items-center">
            <h1 className="text-2xl font-bold">
                Weather Conditions for Paragliding and BASE Jumping
            </h1>

            <p className="text-lg">
                This app helps BASE jumpers and paragliders check weather conditions
                at known exits and any location worldwide. Save your favorite locations,
                track wind and conditions, and quickly decide when and where to fly or jump.
            </p>

            <div className="flex gap-7 pt-4">
                <Link to="/search" className="underline outline-2 p-3 rounded-2xl">
                    Search Weather
                </Link>
                <Link to="/favorites" className="underline outline-2 p-3 rounded-2xl">
                    View Favorites
                </Link>
            </div>
        </div>
    );
}

export default Home;
