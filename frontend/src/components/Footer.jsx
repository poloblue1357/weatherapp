import { Link } from "react-router-dom";
import { AlertCircle } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-blue-950/40 backdrop-blur-sm border-t border-white/10 p-4 text-center text-sm">
            <p className="mb-2 flex items-center justify-center gap-2 text-blue-200">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Always verify conditions on site
            </p>
            <Link
                to="/contact"
                className="text-blue-300 hover:text-white transition-colors underline decoration-blue-400/50 hover:decoration-white"
            >
                Contact Support
            </Link>
        </footer>
    );
}

export default Footer;