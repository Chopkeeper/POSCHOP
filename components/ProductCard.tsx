
import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatter';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div
      onClick={() => onAddToCart(product)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 flex flex-col"
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base flex-grow">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
           <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
             สต็อก: {product.stock}
           </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
