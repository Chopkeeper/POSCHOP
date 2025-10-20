
import React, { useRef } from 'react';
import { Order, Settings } from '../types';
import { formatCurrency } from '../utils/formatter';

interface ReceiptModalProps {
  order: Order | null;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, settings, isOpen, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=400');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Receipt</title>');
            printWindow.document.write('<style>body { font-family: monospace; line-height: 1.4; font-size: 10pt;} table { width: 100%; border-collapse: collapse; } td, th { padding: 2px 0; } .right { text-align: right; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div ref={receiptRef} className="text-gray-800 text-sm">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{settings.storeName}</h2>
                <p>{settings.address}</p>
                <p>ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ</p>
                <p>Order ID: {order.id}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString('th-TH')}</p>
            </div>
            <hr className="my-2 border-dashed"/>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left">รายการ</th>
                        <th className="text-center">จำนวน</th>
                        <th className="text-right">ราคา</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="my-2 border-dashed"/>
            <div>
                <div className="flex justify-between"><span>ยอดรวม</span> <span className="right">{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>ภาษี ({settings.taxRate}%)</span> <span className="right">{formatCurrency(order.tax)}</span></div>
                <div className="flex justify-between font-bold"><span>รวมทั้งสิ้น</span> <span className="right">{formatCurrency(order.total)}</span></div>
            </div>
            <hr className="my-2 border-dashed"/>
            <div>
                <div className="flex justify-between"><span>ชำระโดย</span> <span className="right">{order.paymentMethod}</span></div>
                {order.paymentMethod === 'เงินสด' && (
                    <>
                        <div className="flex justify-between"><span>รับเงิน</span> <span className="right">{formatCurrency(order.receivedAmount || 0)}</span></div>
                        <div className="flex justify-between"><span>เงินทอน</span> <span className="right">{formatCurrency(order.change || 0)}</span></div>
                    </>
                )}
            </div>
            <div className="text-center mt-4">
                <p>ขอบคุณที่ใช้บริการ</p>
            </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button onClick={handlePrint} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700">
            พิมพ์
          </button>
          <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
            ออเดอร์ใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
