import { Link } from "react-router-dom"

function Footer() {

    return (
    <footer className="mt-auto p-4  text-gray-500 text-center pt-8">
        <Link to="/contact" className="underline text-lg">Contact</Link>
        <p className="pt-2 text-sm">
            Disclaimer: Weather data is provided for informational purposes only. Always assess conditions in person.
        </p>
    </footer>
    )
}

export default Footer