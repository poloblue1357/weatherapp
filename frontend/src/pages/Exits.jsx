import NavBar from "../components/NavBar";
import Header from "../components/Header"
// upload new exits and browse known exits
function Exits() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Known Exits" showBackButton={false} />

            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits