import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users, Coins, Lock } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are secured by Solana blockchain technology with military-grade encryption.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Solana processes up to 65,000 transactions per second, making payments instant.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access the marketplace from anywhere in the world, 24/7.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built for the farming community with transparent and fair pricing.'
    },
    {
      icon: Coins,
      title: 'Low Fees',
      description: 'Minimal transaction fees compared to traditional payment methods.'
    },
    {
      icon: Lock,
      title: 'Decentralized',
      description: 'No central authority controls your transactions or data.'
    }
  ];

  const stats = [
    { label: 'Animals Sold', value: '1,234+' },
    { label: 'Happy Farmers', value: '567+' },
    { label: 'Transactions', value: '2,890+' },
    { label: 'Success Rate', value: '99.9%' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-6">
            About Our Marketplace
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the farm animal trade by leveraging the power of Solana blockchain technology.
            Our platform provides a secure, fast, and transparent way to buy and sell farm animals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-dark-700/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-orbitron bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Solana Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold font-orbitron text-white mb-6">
                Powered by Solana
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Solana is one of the fastest and most efficient blockchain platforms in the world. 
                With sub-second finality and extremely low transaction costs, it's the perfect 
                foundation for our marketplace.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span className="text-gray-300">65,000+ transactions per second</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                  <span className="text-gray-300">Sub-second finality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span className="text-gray-300">$0.00025 average transaction cost</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                  <span className="text-gray-300">Environmentally friendly</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center animate-pulse-slow">
                  <div className="w-48 h-48 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold font-orbitron text-center text-white mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Connect Wallet</h4>
              <p className="text-gray-300">
                Connect your Phantom wallet to access the marketplace securely.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Choose Animal</h4>
              <p className="text-gray-300">
                Browse our selection of high-quality farm animals and select your choice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Complete Purchase</h4>
              <p className="text-gray-300">
                Confirm your purchase and receive instant confirmation on the blockchain.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 