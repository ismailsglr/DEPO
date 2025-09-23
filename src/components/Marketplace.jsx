import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { ShoppingCart, DollarSign, AlertCircle, CheckCircle, Wallet } from 'lucide-react';

const recipientAddress = '5BN556ekHrkkBxgmGd9BkQMR4HGPDN4e4NfmuJPPyKC2';

const animalTypes = ['Chicken', 'Duck', 'Cow'];

const animalIcons = {
  Chicken: '🐔',
  Duck: '🦆',
  Cow: '🐮',
};

const MarketplacePage = () => {
  const { connected, sendTransaction, publicKey } = useWallet();
  const [products, setProducts] = useState([]); // Ürünler burada tutulacak
  const [purchases, setPurchases] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'
  const [showModal, setShowModal] = useState(false);

  // Ürünleri backend'den çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Kullanıcının sahip olduğu hayvanları backend'den çek
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!publicKey) return;
      try {
        const res = await fetch(`/api/orders/wallet/${publicKey.toString()}`);
        const orders = await res.json();
        // purchases objesini doldur
        const newPurchases = {};
        orders.forEach(order => {
          const type = order.product.name; // Ürün adı (örn. Chicken, Duck, Cow)
          const tier = order.product.tier || 1; // Eğer tier yoksa 1 kabul et
          const key = `${type}_${tier}`;
          newPurchases[key] = (newPurchases[key] || 0) + 1;
        });
        setPurchases(newPurchases);
      } catch (e) {
        // Hata durumunda purchases sıfırla
        setPurchases({});
      }
    };
    fetchPurchases();
  }, [publicKey]);

  // handlePurchase fonksiyonunda productId olarak animal._id göndereceğiz
  const handlePurchase = async (animal) => {
    if (!connected || !publicKey) {
      setMessage('Wallet not connected!');
      setMessageType('error');
      setShowModal(true);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const txSignature = await sendTransaction(recipientAddress, animal.price);
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { walletAddress: publicKey.toString(), publicKey: publicKey.toString() },
          productId: animal._id, // Artık gerçek _id var
          transactionSignature: txSignature,
          amount: animal.price
        })
      });
      const res = await fetch(`/api/orders/wallet/${publicKey.toString()}`);
      const orders = await res.json();
      const newPurchases = {};
      orders.forEach(order => {
        const type = order.product.name;
        const tier = order.product.tier || 1;
        const key = `${type}_${tier}`;
        newPurchases[key] = (newPurchases[key] || 0) + 1;
      });
      setPurchases(newPurchases);
      setMessage(`${animal.name} Tier ${animal.tier || 1} purchased!`);
      setMessageType('success');
      setShowModal(true);
    } catch (e) {
      setMessage('Purchase failed!');
      setMessageType('error');
      setShowModal(true);
    }
    setLoading(false);
  };

  // Total purchased for each animal type
  const getTotal = (type) =>
    Object.entries(purchases)
      .filter(([key]) => key.startsWith(type + '_'))
      .reduce((sum, [, val]) => sum + val, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-4 pt-24 sm:pt-32">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">Marketplace</h1>
      <div className="flex flex-col gap-8 sm:gap-12">
        {animalTypes.map((type) => (
          <div key={type}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-primary-400 flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl">{animalIcons[type]}</span> {type}s
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
              {products.filter((a) => a.name === type).map((animal) => {
                const key = `${animal.name}_${animal.tier || 1}`;
                return (
                  <div
                    key={key}
                    className="rounded-2xl shadow-xl p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-between border-2 border-primary-400 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 hover:scale-105 transition-transform duration-300 w-full sm:w-[180px] lg:w-[200px] aspect-square"
                  >
                    {/* Top Section */}
                    <div className="flex flex-col items-center text-center">
                      <div className="text-lg sm:text-xl font-bold text-primary-300 mb-2 flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl">{animalIcons[animal.name]}</span> Tier {animal.tier || 1}
                      </div>
                      <div className="text-sm sm:text-base text-gray-200 font-semibold">Price: <span className="font-bold text-secondary-400">{animal.price} SOL</span></div>
                    </div>

                    {/* Middle Section */}
                    <div className="flex flex-col items-center text-center">
                      <div className="text-xs sm:text-sm text-secondary-300 mb-2">
                        You own: <span className="font-bold">{purchases[key] || 0}</span>
                      </div>
                      <div className="text-xs text-gray-300 text-center italic">
                        Earns <span className="font-bold text-primary-200">{animal.reward || 0} coins/hour</span>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <button
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 w-full"
                      onClick={() => handlePurchase(animal)}
                      disabled={loading}
                    >
                      Buy
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 sm:mt-6 text-center text-green-400 text-base sm:text-lg font-bold drop-shadow">
              Total {type.toLowerCase()}s you own: <span className="font-extrabold">{getTotal(type)}</span>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className={`rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-[400px] text-center ${messageType === 'success' ? 'bg-green-700/95 text-white' : 'bg-red-700/95 text-white'}`}>
            <div className="text-xl sm:text-2xl font-bold mb-4">
              {messageType === 'success' ? 'Success!' : 'Error!'}
            </div>
            <div className="text-base sm:text-lg mb-6">{message}</div>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200 transition w-full sm:w-auto"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage; 
