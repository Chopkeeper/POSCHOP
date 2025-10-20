
import React from 'react';
import { OrderItem } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/formatter';

interface OrderSummaryProps {
  onCharge: (total: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ onCharge }) => {
  const { state, dispatch } = useAppContext();
  const { currentOrder, settings } = state;

  const subtotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const handleRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_ORDER', payload: productId });
  };

  const handleClearOrder = () => {
    dispatch({ type: 'CLEAR_ORDER' });
  };

  return (
    <div className="bg-white h-full flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold border-b pb-2">รายการสั่งซื้อ</h2>
      
      {currentOrder.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">ยังไม่มีรายการ</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto my-4 pr-2">
          {currentOrder.map(item => (
            <div key={item.id} className="flex items-center mb-3">
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-3"/>
              <div className="flex-grow">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-gray-600 text-sm">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-6 h-6 bg-gray-200 rounded-full font-bold">-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-6 h-6 bg-gray-200 rounded-full font-bold">+</button>
              </div>
              <button onClick={() => handleRemove(item.id)} className="ml-3 text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between mb-1">
          <span>ยอดรวม</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2 text-gray-600">
          <span>ภาษี ({settings.taxRate}%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>รวมทั้งสิ้น</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={handleClearOrder}
                disabled={currentOrder.length === 0}
                className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-lg hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-400"
            >
                ล้างรายการ
            </button>
            <button
                onClick={() => onCharge(total)}
                disabled={currentOrder.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                ชำระเงิน
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
