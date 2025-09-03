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
    <div className="max-w-6xl mx-auto py-12 px-4 pt-32">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">Marketplace</h1>
      <div className="flex flex-col gap-12">
        {animalTypes.map((type) => (
          <div key={type}>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-400 flex items-center justify-center gap-2">
              <span className="text-3xl">{animalIcons[type]}</span> {type}s
            </h2>
            <div className="flex flex-row gap-8 justify-center">
              {products.filter((a) => a.name === type).map((animal) => {
                const key = `${animal.name}_${animal.tier || 1}`;
                return (
                  <div
                    key={key}
                    className="rounded-2xl shadow-xl p-7 flex flex-col items-center border-2 border-primary-400 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 hover:scale-105 transition-transform duration-300 min-w-[220px] max-w-[240px]"
                  >
                    <div className="text-2xl font-bold text-primary-300 mb-1 flex items-center gap-2">
                      <span className="text-3xl">{animalIcons[animal.name]}</span> Tier {animal.tier || 1}
                    </div>
                    <div className="mb-2 text-lg text-gray-200 font-semibold">Price: <span className="font-bold text-secondary-400">{animal.price} SOL</span></div>
                    <button
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 mb-2 mt-2"
                      onClick={() => handlePurchase(animal)}
                      disabled={loading}
                    >
                      Buy
                    </button>
                    <div className="text-base text-secondary-300 mb-1 mt-2">
                      You own: <span className="font-bold">{purchases[key] || 0}</span>
                    </div>
                    <div className="text-sm text-gray-300 text-center mt-2 italic">
                      {type} Tier {animal.tier || 1} earns <span className="font-bold text-primary-200">{animal.reward || 0} coins/hour</span>.
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center text-green-400 text-lg font-bold drop-shadow">
              Total {type.toLowerCase()}s you own: <span className="font-extrabold">{getTotal(type)}</span>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] text-center ${messageType === 'success' ? 'bg-green-700/95 text-white' : 'bg-red-700/95 text-white'}`}>
            <div className="text-2xl font-bold mb-4">
              {messageType === 'success' ? 'Success!' : 'Error!'}
            </div>
            <div className="text-lg mb-6">{message}</div>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
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