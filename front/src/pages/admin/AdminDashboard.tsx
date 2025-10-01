import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { Package, ShoppingBag, FolderTree, DollarSign, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders, categories] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
          categoryService.getAll(),
        ]);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCategories: categories.length,
          pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Pedidos',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Categorías',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'bg-purple-500',
      link: '/admin/categories',
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      link: '/admin/orders?status=PENDING',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products/new"
              className="block p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
            >
              <p className="font-semibold text-primary-900">Agregar Producto</p>
              <p className="text-sm text-primary-700">Crear un nuevo producto</p>
            </Link>
            <Link
              to="/admin/categories"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <p className="font-semibold text-purple-900">Gestionar Categorías</p>
              <p className="text-sm text-purple-700">Administrar categorías de productos</p>
            </Link>
            <Link
              to="/admin/orders"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <p className="font-semibold text-green-900">Ver Pedidos</p>
              <p className="text-sm text-green-700">Gestionar todos los pedidos</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Sistema</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Versión</p>
              <p className="font-semibold text-gray-900">1.0.0</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Base de datos</p>
              <p className="font-semibold text-gray-900">PostgreSQL</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Estado del sistema</p>
              <p className="font-semibold text-green-600">Operativo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};