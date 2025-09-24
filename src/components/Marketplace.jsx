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
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState({});
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [userCoins, setUserCoins] = useState(0);

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

  const fetchPurchases = async () => {
    if (!publicKey) return;
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          publicKey: publicKey.toString()
        })
      });
      const userRes = await fetch(`/api/users/wallet/${publicKey.toString()}`);
      const userData = await userRes.json();
      setUserCoins(userData.coins || 0);
      const res = await fetch(`/api/orders/wallet/${publicKey.toString()}`);
      const orders = await res.json();
      const newPurchases = {};
      orders.forEach(order => {
        const type = order.products.name;
        const tier = order.products.tier || 1;
        const key = `${type}_${tier}`;
        newPurchases[key] = (newPurchases[key] || 0) + 1;
      });
      setPurchases(newPurchases);
    } catch (e) {
      console.error('Alışverişleri getirirken hata oluştu:', e);
      setPurchases({});
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [publicKey]);

  const handlePurchase = async (animal) => {
    if (!connected || !publicKey) {
      setMessage('Cüzdan bağlı değil!');
      setMessageType('error');
      setShowModal(true);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const txSignature = await sendTransaction(recipientAddress, animal.price);
      console.log('İşlem başarılı, sipariş backend\'e gönderiliyor...');
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { walletAddress: publicKey.toString(), publicKey: publicKey.toString() },
          productId: animal.id,
          transactionSignature: txSignature,
          amount: animal.price
        })
      });
      console.log('Sipariş yanıtı durumu:', orderResponse.status);
      if (!orderResponse.ok) {
        console.error('Sipariş oluşturma başarısız:', orderResponse.statusText);
        throw new Error(`Sipariş oluşturma başarısız: ${orderResponse.statusText}`);
      }
      
      // KULLANICI İSTATİSTİKLERİNİ GÜNCELLE
      await fetch(`/api/users/wallet/${publicKey.toString()}/stats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: animal.price })
      });

      await fetchPurchases();
      
      setMessage(`${animal.name} Tier ${animal.tier || 1} satın alındı!`);
      setMessageType('success');
      setShowModal(true);
    } catch (e) {
      setMessage('Satın alma başarısız oldu!');
      setMessageType('error');
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleClaimRewards = async () => {
    if (!connected || !publicKey) {
      setMessage('Cüzdan bağlı değil!');
      setMessageType('error');
      setShowModal(true);
      return;
    }
    setClaiming(true);
    try {
      const res = await fetch(`/api/users/wallet/${publicKey.toString()}/claim-rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });
      if (!res.ok) {
        throw new Error('Ödülleri toplama başarısız oldu.');
      }
      const data = await res.json();
      setUserCoins(data.newCoinBalance);
      setMessage(`${data.claimedAmount} coin kazandınız!`);
      setMessageType('success');
      setShowModal(true);
    } catch (e) {
      setMessage('Ödülleri toplarken bir hata oluştu.');
      setMessageType('error');
      setShowModal(true);
    } finally {
      setClaiming(false);
    }
  };

  const getTotal = (type) =>
    Object.entries(purchases)
      .filter(([key]) => key.startsWith(type + '_'))
      .reduce((sum, [, val]) => sum + val, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-2 sm:px-4 pt-24 sm:pt-32">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent drop-shadow-lg">Marketplace</h1>
      
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <DollarSign size={24} /> Coins: {userCoins}
        </div>
        <button
          onClick={handleClaimRewards}
          disabled={claiming}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claiming ? 'Toplanıyor...' : 'Ödülleri Topla'}
        </button>
      </div>

      <div className="flex flex-col gap-8 sm:gap-12">
        {animalTypes.map((type) => (
          <div key={type}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-primary-400 flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl">{animalIcons[type]}</span> {type}s
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center">
              {products.filter((a) => a.name === type).map((animal) => {
                const key = `${animal.name}_${animal.tier || 1}`;
                return (
                  <div
                    key={key}
                    className="rounded-2xl shadow-xl p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-between border-2 border-primary-400 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 hover:scale-105 transition-transform duration-300 w-1/2 sm:w-[140px] md:w-[150px] lg:w-[200px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px]"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-sm sm:text-xl font-bold text-primary-300 mb-2 flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl">{animalIcons[animal.name]}</span> T{animal.tier || 1}
                      </div>
                      <div className="text-sm sm:text-base text-gray-200 font-semibold">Fiyat: <span className="font-bold text-secondary-400">{animal.price} SOL</span></div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-xs sm:text-sm text-secondary-300 mb-2">
                        Sahip olduğun: <span className="font-bold">{purchases[key] || 0}</span>
                      </div>
                      <div className="text-xs text-gray-300 text-center italic">
                        <span className="font-bold text-primary-200">{animal.reward || 0} coin/saat</span> kazandırır
                      </div>
                    </div>
                    <button
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 w-full"
                      onClick={() => handlePurchase(animal)}
                      disabled={loading}
                    >
                      Satın Al
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 sm:mt-6 text-center text-green-400 text-base sm:text-lg font-bold drop-shadow">
              Sahip olduğun toplam {type.toLowerCase()} sayısı: <span className="font-extrabold">{getTotal(type)}</span>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className={`rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-[400px] text-center ${messageType === 'success' ? 'bg-green-700/95 text-white' : 'bg-red-700/95 text-white'}`}>
            <div className="text-xl sm:text-2xl font-bold mb-4">
              {messageType === 'success' ? 'Başarılı!' : 'Hata!'}
            </div>
            <div className="text-base sm:text-lg mb-6">{message}</div>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200 transition w-full sm:w-auto"
              onClick={() => setShowModal(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;