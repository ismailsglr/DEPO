import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/farmmarket',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/farmmarket',
      color: 'hover:text-gray-400'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:contact@farmmarket.com',
      color: 'hover:text-red-400'
    }
  ];

  return (
    <footer className="bg-dark-900 border-t border-dark-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
              FarmMarket
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              The future of farm animal trading is here. Secure, fast, and transparent 
              transactions powered by Solana blockchain technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-300 ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#marketplace" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-600/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} FarmMarket. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>using Solana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
