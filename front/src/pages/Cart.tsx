import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-8">
          Agrega productos para comenzar tu compra
        </p>
        <Link to="/products" className="btn btn-primary">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card flex gap-4">
              <img
                src={item.product.images[0] || 'https://via.placeholder.com/200'}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <Link
                  to={`/product/${item.product.slug}`}
                  className="font-semibold text-gray-900 hover:text-primary-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {item.product.category?.name}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ${Number(item.product.price).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="btn btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <Trash2 size={18} />
            <span>Vaciar carrito</span>
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen del pedido
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary w-full py-3"
            >
              Proceder al pago
            </button>

            <Link
              to="/products"
              className="block text-center text-primary-600 hover:text-primary-700 mt-4"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};