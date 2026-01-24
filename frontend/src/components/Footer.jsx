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