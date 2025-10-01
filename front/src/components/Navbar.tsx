import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useState } from 'react';

export const Navbar = () => {
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TS</span>
            </div>
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
            </Link>

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