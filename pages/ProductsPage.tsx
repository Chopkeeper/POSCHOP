import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatter';
import { CATEGORIES } from '../constants';
import { generateDescription } from '../services/geminiService';

const ProductModal: React.FC<{
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
}> = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Product | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                id: '',
                name: '',
                category: CATEGORIES[0],
                price: 0,
                stock: 0,
                imageUrl: 'https://picsum.photos/300/200',
                description: '',
                prepTimeInMinutes: 5,
            });
        }
    }, [product]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'price' || name === 'stock' || name === 'prepTimeInMinutes' ? Number(value) : value 
        });
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleGenerateDesc = async () => {
        if (!formData.name || !formData.category) {
            alert('กรุณากรอกชื่อสินค้าและหมวดหมู่ก่อน');
            return;
        }
        setIsGenerating(true);
        const desc = await generateDescription(formData.name, formData.category);
        setFormData({ ...formData, description: desc });
        setIsGenerating(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                <h2 className="text-2xl font-bold mb-4">{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                <div className="space-y-4">
                    <div>
                        <label>ชื่อสินค้า</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>หมวดหมู่</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>ราคา</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label>จำนวนสต็อก</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                           <label>เวลาในการเตรียม (นาที)</label>
                           <input type="number" name="prepTimeInMinutes" value={formData.prepTimeInMinutes} onChange={handleChange} className="w-full p-2 border rounded" />
                       </div>
                    </div>
                    <div>
                           <label>URL รูปภาพ</label>
                           <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label>คำอธิบายสินค้า</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
                        <button onClick={handleGenerateDesc} disabled={isGenerating} className="mt-2 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 flex items-center justify-center">
                            {isGenerating ? 'กำลังสร้าง...' : 'สร้างคำอธิบายด้วย AI ✨'}
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">ยกเลิก</button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg">บันทึก</button>
                </div>
            </div>
        </div>
    );
};

const ProductsPage: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };
    
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };
    
    const handleDeleteProduct = (productId: string) => {
        if(window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
            dispatch({ type: 'DELETE_PRODUCT', payload: productId });
        }
    };

    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            dispatch({ type: 'UPDATE_PRODUCT', payload: product });
        } else {
            dispatch({ type: 'ADD_PRODUCT', payload: { ...product, id: `p${Date.now()}` } });
        }
        setModalOpen(false);
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
                <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                    + เพิ่มสินค้าใหม่
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">รูปภาพ</th>
                            <th className="p-3 text-left">ชื่อสินค้า</th>
                            <th className="p-3 text-left">หมวดหมู่</th>
                            <th className="p-3 text-right">ราคา</th>
                            <th className="p-3 text-right">สต็อก</th>
                            <th className="p-3 text-right">เวลาเตรียม (นาที)</th>
                            <th className="p-3 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.products.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="p-3"><img src={product.imageUrl} alt={product.name} className="w-16 h-12 object-cover rounded"/></td>
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3 text-gray-600">{product.category}</td>
                                <td className="p-3 text-right">{formatCurrency(product.price)}</td>
                                <td className="p-3 text-right">{product.stock}</td>
                                <td className="p-3 text-right">{product.prepTimeInMinutes}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 mr-2">แก้ไข</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ProductModal 
                isOpen={isModalOpen} 
                product={editingProduct} 
                onClose={() => setModalOpen(false)}
                onSave={handleSaveProduct}
            />
        </div>
    );
};

export default ProductsPage;
