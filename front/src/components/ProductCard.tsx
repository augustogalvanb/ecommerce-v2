import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Stock: {product.stock} unidades
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary flex items-center space-x-2"
            >
              <ShoppingCart size={18} />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};