import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, User } from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [topBuyers, setTopBuyers] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Tüm siparişleri çekme
                const ordersRes = await fetch('/api/orders');
                if (!ordersRes.ok) throw new Error('Siparişler çekilemedi.');
                const ordersData = await ordersRes.json();
                setOrders(ordersData);

                // İstatistikleri hesaplama
                let totalRevenue = 0;
                let totalOrders = ordersData.length;
                ordersData.forEach(order => {
                    totalRevenue += order.transaction_amount;
                });
                setStats({ totalRevenue, totalOrders });

                // En çok harcayan kullanıcıları çekme
                const topBuyersRes = await fetch('/api/users/stats/top-buyers');
                if (!topBuyersRes.ok) throw new Error('En çok harcayanlar çekilemedi.');
                const topBuyersData = await topBuyersRes.json();
                setTopBuyers(topBuyersData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">Hata: {error}</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 md:p-12 pt-28 md:pt-32"
        >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary-400">Yönetim Paneli</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-dark-800 p-6 rounded-xl shadow-lg border-2 border-primary-400">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Toplam Gelir</h2>
                        <DollarSign size={24} className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                        ${stats.totalRevenue.toFixed(2)}
                    </p>
                </div>
                
                <div className="bg-dark-800 p-6 rounded-xl shadow-lg border-2 border-primary-400">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Toplam Sipariş</h2>
                        <ShoppingCart size={24} className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                        {stats.totalOrders}
                    </p>
                </div>

                <div className="bg-dark-800 p-6 rounded-xl shadow-lg border-2 border-primary-400">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Top Alıcılar</h2>
                        <User size={24} className="text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-purple-400">
                        {topBuyers.length > 0 ? topBuyers[0].wallet_address.substring(0, 4) + '...' : 'Yok'}
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-400 mb-6">Tüm Siparişler</h2>
            <div className="bg-dark-800 rounded-xl p-4 shadow-lg border-2 border-secondary-400 overflow-x-auto">
                <table className="min-w-full text-left text-gray-200">
                    <thead className="border-b-2 border-gray-600">
                        <tr>
                            <th className="p-3 font-semibold text-sm tracking-wide">ID</th>
                            <th className="p-3 font-semibold text-sm tracking-wide">Kullanıcı</th>
                            <th className="p-3 font-semibold text-sm tracking-wide">Ürün</th>
                            <th className="p-3 font-semibold text-sm tracking-wide">Fiyat (SOL)</th>
                            <th className="p-3 font-semibold text-sm tracking-wide">Tarih</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-3 text-sm">{order.id.substring(0, 8)}...</td>
                                <td className="p-3 text-sm">{order.user_wallet_address.substring(0, 6)}...</td>
                                <td className="p-3 text-sm">{order.products.name} (T{order.products.tier})</td>
                                <td className="p-3 text-sm font-semibold text-secondary-300">{order.transaction_amount}</td>
                                <td className="p-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </motion.div>
    );
};

export default AdminDashboard;