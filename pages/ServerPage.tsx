import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

const ServeTicket: React.FC<{ order: Order; onStatusChange: (orderId: string, status: OrderStatus) => void; }> = ({ order, onStatusChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm">
            <div className="bg-green-500 text-white p-3 rounded-t-lg">
                <h3 className="font-bold text-xl">Order #{order.id.substring(order.id.length - 6)}</h3>
                <p>Status: <span className="font-semibold">{order.status}</span></p>
            </div>
            <ul className="p-4 h-56 overflow-y-auto divide-y">
                {order.items.map(item => (
                    <li key={item.id} className="py-2 flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-lg font-bold">x{item.quantity}</span>
                    </li>
                ))}
            </ul>
            <div className="p-4 bg-gray-50 rounded-b-lg">
                <button 
                    onClick={() => onStatusChange(order.id, OrderStatus.Served)}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 text-lg"
                >
                    เสิร์ฟแล้ว
                </button>
            </div>
        </div>
    );
};

const ServerPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    
    // Filter orders that are ready to be served
    const readyOrders = state.liveOrders.filter(
        o => o.status === OrderStatus.Ready
    );

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    };

    return (
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">รายการพร้อมเสิร์ฟ</h1>
            {readyOrders.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-2xl text-gray-500">ไม่มีรายการที่พร้อมเสิร์ฟ</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {readyOrders.map(order => (
                        <ServeTicket key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServerPage;