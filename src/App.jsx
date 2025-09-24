import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketplacePage from './components/Marketplace';
import About from './components/About';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard'; // AdminDashboard.jsx dosyasını import edin


function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Router>
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <Routes>
          <Route path="/" element={<Hero setActiveSection={setActiveSection} />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App; 