// import { Link } from "react-router-dom"

// function Footer() {

//     return (
//     <footer className="mt-auto p-4  text-gray-500 text-center pt-8">
//         <Link to="/contact" className="underline text-lg">Contact</Link>
//         <p className="pt-2 text-sm">
//             Disclaimer: Weather data is provided for informational purposes only. Always assess conditions in person.
//         </p>
//     </footer>
//     )
// }

// export default Footer

// old code - don't delete



import { Link } from "react-router-dom";
import { AlertCircle } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-black/30 backdrop-blur-sm p-4 text-center text-sm text-white/90">
        <p className="mb-2 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            For informational purposes only - verify all conditions
        </p>
        <Link
            to="/contact"
            className="text-amber-300 hover:text-amber-200 font-semibold underline"
        >
            Contact Support
        </Link>
        </footer>
    );
}

export default Footer;