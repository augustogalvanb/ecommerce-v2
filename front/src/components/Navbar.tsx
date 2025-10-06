import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Clock } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useState, useEffect } from 'react';
import Logo from '../assets/logo.svg'

export const Navbar = () => {
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasPendingOrder, setHasPendingOrder] = useState(false);

  useEffect(() => {
    // Verificar órdenes pendientes cada vez que cambia la ruta
    const checkPendingOrder = () => {
      const storedOrder = localStorage.getItem('pending_order');
      if (storedOrder) {
        const orderData = JSON.parse(storedOrder);
        const createdAt = new Date(orderData.createdAt);
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
        
        if (elapsedSeconds < 600) {
          setHasPendingOrder(true);
        } else {
          localStorage.removeItem('pending_order');
          setHasPendingOrder(false);
        }
      } else {
        setHasPendingOrder(false);
      }
    };

    checkPendingOrder();
    
    // Verificar cada 10 segundos
    const interval = setInterval(checkPendingOrder, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="TechStore" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-900">TechStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition">
              Productos
            </Link>
            <Link to="/track-order" className="text-gray-700 hover:text-primary-600 transition">
              Rastrear Pedido
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contacto
            </Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <ShoppingCart size={24} />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
              {hasPendingOrder && (
                <span className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full w-3 h-3 animate-pulse" 
                      title="Tienes una orden pendiente">
                </span>
              )}
            </Link>

            {/* Indicador de orden pendiente (Desktop) */}
            {hasPendingOrder && (
              <Link 
                to="/cart"
                className="hidden md:flex items-center space-x-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium transition"
              >
                <Clock size={16} />
                <span>Orden pendiente</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {hasPendingOrder && (
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Clock size={16} />
                <span>Tienes una orden pendiente</span>
              </Link>
            )}
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/track-order"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Rastrear Pedido
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};