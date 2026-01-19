import React from 'react';
import './index.css';
import Search from "./components/Search"
import Home from "./components/Home"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  
  return (
    <Router>

      <div className="bg-red-500">
        <h1 className="text-4xl font-bold">Welcome to Weather App!</h1>
      </div>

        <div>
          <Search />
        </div>

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/search" element={<Search />} />
        </Routes>

    </Router>
  )
}

export default App;
