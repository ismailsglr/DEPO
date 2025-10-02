import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ activeSection, setActiveSection }) => {
  const { connected, connectWallet, disconnectWallet, balance, publicKey } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'marketplace', label: 'Marketplace', href: '/marketplace' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'admin', label: 'Admin', href: '/admin' },
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.toString().slice(0, 4)}...${address.toString().slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-xl border-b border-dark-600/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent cursor-pointer">
                  FarmMarket
                </h1>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'text-primary-400 bg-primary-400/10'
                      : 'text-gray-300 hover:text-primary-400 hover:bg-primary-400/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {connected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm text-gray-300">
                    {formatAddress(publicKey)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {balance.toFixed(4)} SOL
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2"
                >
                  <Wallet size={16} />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Wallet size={16} />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-dark-600/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'text-primary-400 bg-primary-400/10'
                    : 'text-gray-300 hover:text-primary-400 hover:bg-primary-400/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 