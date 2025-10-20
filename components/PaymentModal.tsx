import * as React from 'react';
import { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatter';

interface PaymentModalProps {
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod, receivedAmount?: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, isOpen, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(PaymentMethod.Cash);
  const [receivedAmount, setReceivedAmount] = React.useState<string>('');
  
  if (!isOpen) return null;

  const received = parseFloat(receivedAmount) || 0;
  const change = received >= total ? received - total : 0;
  const canConfirm = (paymentMethod === PaymentMethod.Cash && received >= total) || paymentMethod !== PaymentMethod.Cash;

  const handleConfirm = () => {
    onConfirm(paymentMethod, paymentMethod === PaymentMethod.Cash ? received : undefined);
    setReceivedAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">ชำระเงิน</h2>
        <p className="text-center text-4xl font-bold text-blue-600 mb-6">{formatCurrency(total)}</p>

        <div className="flex justify-center border-b mb-6">
          {Object.values(PaymentMethod).map(method => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`px-6 py-2 text-lg font-semibold ${paymentMethod === method ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              {method}
            </button>
          ))}
        </div>

        {paymentMethod === PaymentMethod.Cash && (
          <div className="text-center">
            <label htmlFor="receivedAmount" className="text-lg text-gray-600 block mb-2">จำนวนเงินที่รับ</label>
            <input
              id="receivedAmount"
              type="number"
              value={receivedAmount}
              onChange={e => setReceivedAmount(e.target.value)}
              className="text-center text-3xl font-bold w-full p-2 border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              autoFocus
            />
             <div className="mt-4 text-xl">
              <span>เงินทอน: </span>
              <span className="font-bold text-green-600">{formatCurrency(change)}</span>
            </div>
          </div>
        )}
        
        {paymentMethod === PaymentMethod.QRCode && (
            <div className="flex flex-col items-center">
                <p className="text-lg mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=promptpay-${total}`} alt="QR Code" className="w-48 h-48 border p-1"/>
            </div>
        )}
        
        {paymentMethod === PaymentMethod.CreditCard && (
            <div className="text-center">
                <p className="text-lg text-gray-500">กรุณาเสียบบัตรที่เครื่องอ่าน</p>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 my-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
        )}

        <div className="mt-8 flex gap-4">
          <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300">
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;