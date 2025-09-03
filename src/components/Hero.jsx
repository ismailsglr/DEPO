import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ShoppingCart, Zap } from 'lucide-react';

const Hero = ({ setActiveSection }) => {
  const scrollToMarketplace = () => {
    setActiveSection('marketplace');
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-orbitron bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent leading-tight"
          >
            Farm Animal
            <br />
            <span className="text-6xl md:text-8xl">Marketplace</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Buy and sell farm animals using Solana blockchain. 
            <span className="text-secondary-400 font-semibold"> Secure, fast, and decentralized.</span>
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <Zap className="w-5 h-5 text-secondary-400" />
              <span>Instant Transactions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ShoppingCart className="w-5 h-5 text-primary-400" />
              <span>Secure Payments</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={scrollToMarketplace}
              className="group bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className="group border-2 border-gray-600 hover:border-primary-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-primary-400/10 flex items-center space-x-2"
            >
              <span>Learn More</span>
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero; 