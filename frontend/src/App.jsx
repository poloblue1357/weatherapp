import './index.css';
import Header from './components/Header'
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Route, Routes } from 'react-router-dom';

// importing pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import SavedLocation from './pages/SavedLocations';
import Search from './pages/Search';

function App() {
  
  return (
    <div>
      <Header />
      <NavBar />

      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/savedlocations" element={<SavedLocation />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;
