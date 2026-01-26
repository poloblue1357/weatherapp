import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header({ title, showBackButton = false, subtitle = null }) {
    const navigate = useNavigate();

    return (
        <header className="bg-black/20 backdrop-blur-sm text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
            {showBackButton ? (
            <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            ) : (
            <div className="w-10"></div>
            )}
        
            <div className="text-center">
            <h1 className="text-xl font-semibold tracking-wide">
                {title || 'ExitWx'}
            </h1>
            {subtitle && (
                <p className="text-blue-100 text-sm mt-1 font-light tracking-wider">
                {subtitle}
                </p>
            )}
            </div>
        
            <div className="w-10"></div>
        </div>
        </header>
    );
}

export default Header;