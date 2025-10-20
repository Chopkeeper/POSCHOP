import * as React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import OrderSummary from '../components/OrderSummary';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import { Product, Order, PaymentMethod, OrderStatus } from '../types';
import { CATEGORIES } from '../constants';

const SalesPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('ทั้งหมด');
  const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [isReceiptModalOpen, setReceiptModalOpen] = React.useState(false);
  const [lastOrder, setLastOrder] = React.useState<Order | null>(null);
  const [totalToCharge, setTotalToCharge] = React.useState(0);

  const filteredProducts = React.useMemo(() => {
    return state.products.filter(product => {
      const matchesCategory = activeCategory === 'ทั้งหมด' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [state.products, activeCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_ORDER', payload: product });
  };
  
  const handleCharge = (total: number) => {
    setTotalToCharge(total);
    setPaymentModalOpen(true);
  };
  
  const handleConfirmPayment = (paymentMethod: PaymentMethod, receivedAmount?: number) => {
    if (!state.currentUser) {
        alert("ไม่พบข้อมูลผู้ใช้ โปรดเข้าสู่ระบบใหม่");
        return;
    }

    const subtotal = state.currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * (state.settings.taxRate / 100);
    const total = subtotal + tax;
    const totalPrepTime = state.currentOrder.reduce((sum, item) => sum + (item.prepTimeInMinutes * item.quantity), 0);
    const orderId = `ORD-${Date.now()}`;

    const newOrderPayload: Omit<Order, 'createdAt'> = {
        id: orderId,
        items: state.currentOrder,
        subtotal,
        tax,
        total,
        paymentMethod,
        receivedAmount: receivedAmount,
        change: receivedAmount ? receivedAmount - total : 0,
        cashierId: state.currentUser.id,
        totalPrepTime,
        status: OrderStatus.Paid,
    };
    
    dispatch({ type: 'CREATE_ORDER', payload: newOrderPayload });
    
    const createdOrderForReceipt: Order = {
        ...newOrderPayload,
        createdAt: new Date().toISOString(),
    };

    setLastOrder(createdOrderForReceipt);
    setPaymentModalOpen(false);
    setReceiptModalOpen(true);
  };

  const handleNewOrder = () => {
    setReceiptModalOpen(false);
    setLastOrder(null);
    dispatch({ type: 'CLEAR_ORDER' });
  };


  return (
    <div className="flex-1 flex h-full">
      <div className="flex-1 flex flex-col p-4 bg-gray-100 overflow-y-auto">
        <header className="mb-4">
            <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('ทั้งหมด')}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${activeCategory === 'ทั้งหมด' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                    ทั้งหมด
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
      <aside className="w-1/3 max-w-sm flex-shrink-0">
        <OrderSummary onCharge={handleCharge} />
      </aside>
      
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        total={totalToCharge}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />
      
      <ReceiptModal 
        isOpen={isReceiptModalOpen}
        order={lastOrder}
        settings={state.settings}
        onClose={handleNewOrder}
      />
    </div>
  );
};

export default SalesPage;