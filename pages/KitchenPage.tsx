import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

const OrderTicket: React.FC<{ order: Order; onStatusChange: (orderId: string, status: OrderStatus) => void; }> = ({ order, onStatusChange }) => {
    const getStatusColor = () => {
        switch(order.status) {
            case OrderStatus.New: return 'bg-blue-500';
            case OrderStatus.Paid: return 'bg-blue-500';
            case OrderStatus.Preparing: return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80 flex-shrink-0">
            <div className={`flex justify-between items-center p-2 rounded-t-lg text-white ${getStatusColor()}`}>
                <h3 className="font-bold text-lg">{order.id}</h3>
                <span className="font-semibold">{order.status}</span>
            </div>
            <div className="py-2">
                <p className="text-sm text-gray-500">เวลาที่คาดการณ์: <span className="font-bold">{order.totalPrepTime} นาที</span></p>
            </div>
            <ul className="h-48 overflow-y-auto border-t border-b py-2 my-2">
                {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-center py-1">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-500">เวลา: {item.prepTimeInMinutes} นาที</p>
                        </div>
                        <span className="font-bold text-lg">x{item.quantity}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-2 flex flex-col gap-2">
                 {(order.status === OrderStatus.New || (order.status === OrderStatus.Paid && order.totalPrepTime > 0)) && (
                    <button 
                        onClick={() => onStatusChange(order.id, OrderStatus.Preparing)}
                        className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg hover:bg-yellow-600">
                        เริ่มทำอาหาร
                    </button>
                 )}
                 {order.status === OrderStatus.Preparing && (
                    <button 
                        onClick={() => onStatusChange(order.id, OrderStatus.Ready)}
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">
                        เสร็จแล้ว (พร้อมเสิร์ฟ)
                    </button>
                 )}
            </div>
        </div>
    );
};


const KitchenPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    
    const activeOrders = state.liveOrders.filter(o =>
        o.status === OrderStatus.New || 
        o.status === OrderStatus.Preparing ||
        (o.status === OrderStatus.Paid && o.totalPrepTime > 0)
    );

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    };

    return (
        <div className="flex-1 p-6 bg-gray-800 text-white overflow-x-auto">
            <h1 className="text-3xl font-bold mb-6">Kitchen Display System (KDS)</h1>
            {activeOrders.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-2xl text-gray-400">ไม่มีรายการอาหารที่ต้องทำ</p>
                </div>
            ) : (
                <div className="flex space-x-6 pb-4">
                    {activeOrders.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(order => (
                        <OrderTicket key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenPage;