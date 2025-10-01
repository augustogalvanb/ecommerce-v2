import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  LogOut,
} from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, logout, admin } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">{admin?.name}</p>
        </div>

        <nav className="mt-6">
          <Link
            to="/admin"
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition"
          >
            <FolderTree size={20} />
            <span>Categorías</span>
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition"
          >
            <Package size={20} />
            <span>Productos</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-800 transition"
          >
            <ShoppingBag size={20} />
            <span>Pedidos</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
};