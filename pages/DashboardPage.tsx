import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/formatter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, OrderStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    const { state } = useAppContext();
    const { liveOrders, products } = state;

    // Filter for paid orders to represent sales history
    const orderHistory = useMemo(() => liveOrders.filter(o => o.status === OrderStatus.Paid), [liveOrders]);

    const todayStats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysOrders = orderHistory.filter(o => o.createdAt.startsWith(today));
        const totalSales = todaysOrders.reduce((sum, o) => sum + o.total, 0);
        return {
            sales: totalSales,
            orders: todaysOrders.length
        };
    }, [orderHistory]);

    const bestSellers = useMemo(() => {
        const itemCounts: { [key: string]: number } = {};
        orderHistory.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.id] = (itemCounts[item.id] || 0) + item.quantity;
            });
        });
        return Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id, count]) => ({
                product: products.find(p => p.id === id),
                count
            }));
    }, [orderHistory, products]);

    const salesByDay = useMemo(() => {
        const days: { [key: string]: { date: string, sales: number } } = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' });
            days[d.toISOString().split('T')[0]] = { date: dateStr, sales: 0 };
        }
        orderHistory.forEach(order => {
            const orderDate = order.createdAt.split('T')[0];
            if (days[orderDate]) {
                days[orderDate].sales += order.total;
            }
        });
        return Object.values(days);
    }, [orderHistory]);


    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">แดชบอร์ด</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="ยอดขายวันนี้" 
                    value={formatCurrency(todayStats.sales)} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                    color="bg-green-500"
                />
                 <StatCard 
                    title="ออเดอร์วันนี้" 
                    value={todayStats.orders} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                    color="bg-blue-500"
                />
                 <StatCard 
                    title="สินค้าทั้งหมด" 
                    value={products.length} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">ยอดขาย 7 วันล่าสุด</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)}/>
                            <Legend />
                            <Bar dataKey="sales" fill="#3B82F6" name="ยอดขาย" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">สินค้าขายดี 5 อันดับ</h2>
                    <ul>
                        {bestSellers.map(({ product, count }, index) => product && (
                            <li key={product.id} className="flex items-center justify-between py-2 border-b">
                                <div className="flex items-center">
                                    <span className="font-bold mr-3">{index + 1}.</span>
                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                                    <span>{product.name}</span>
                                </div>
                                <span className="font-bold">{count} ชิ้น</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
