import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Exits from './pages/Exits';
import Search from './pages/Search';
import Footer from './components/Footer';
import { FavoritesProvider } from './context/FavoritesContext';
import Forecast from "./components/Forecast"

function App() {
  const location = useLocation();
  const showFooter = location.pathname === '/';

  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/exits" element={<Exits />} />
            <Route path="/forecast" element={<Forecast />} />
          </Routes>
        </main>
        {showFooter && <Footer />}
      </div>
    </FavoritesProvider>
  );
}

export default App;
