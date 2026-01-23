// import Header from './components/Header'
// import NavBar from "./components/NavBar"
// import Footer from "./components/Footer"
// import { Route, Routes } from 'react-router-dom';

// // importing pages
// import Home from './pages/Home';
// import Contact from './pages/Contact';
// import Favorites from './pages/Favorites';
// import Exits from './pages/Exits';
// import Search from './pages/Search';

// function App() {
  
//   return (
//     <div>
//       <Header />
//       <NavBar />

//       <main className="">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/search" element={<Search />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/favorites" element={<Favorites />} />
//           <Route path="/exits" element={<Exits />} />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   )
// }

// export default App;

// old code - don't delete

import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Exits from './pages/Exits';
import Search from './pages/Search';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/exits" element={<Exits />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
