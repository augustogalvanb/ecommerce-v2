import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">TechStore</h3>
            <p className="text-sm">
              Tu tienda de tecnología de confianza. Ofrecemos los mejores productos con la mejor atención al cliente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm hover:text-white transition">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={16} />
                <span>info@techstore.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={16} />
                <span>+54 381 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin size={16} />
                <span>San Miguel de Tucumán, Argentina</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 TechStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};