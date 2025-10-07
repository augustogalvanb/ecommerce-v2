import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { categoryService } from '../../services/categoryService';
import { Package, ShoppingBag, FolderTree, AlertTriangle, TrendingUp, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  images: string[];
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllLowStock, setShowAllLowStock] = useState(false);

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
        });

        // Filtrar productos con bajo stock (menos de 10 unidades)
        const lowStock = products
          .filter((p) => p.stock < 10 && p.isActive)
          .sort((a, b) => a.stock - b.stock);
        
        setLowStockProducts(lowStock);
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
  ];

  const displayedProducts = showAllLowStock 
    ? lowStockProducts 
    : lowStockProducts.slice(0, 3);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Productos con Bajo Stock</h2>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                {lowStockProducts.length}
              </span>
            )}
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-600">No hay productos con bajo stock</p>
              <p className="text-sm text-gray-500 mt-1">(Menos de 10 unidades)</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/100'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock < 5 
                          ? 'text-orange-600' 
                          : 'text-yellow-600'
                      }`}>
                        {product.stock}
                      </p>
                      <p className="text-xs text-gray-500">unidades</p>
                    </div>
                  </div>
                ))}
              </div>

              {lowStockProducts.length > 3 && (
                <button
                  onClick={() => setShowAllLowStock(!showAllLowStock)}
                  className="w-full py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-lg transition"
                >
                  {showAllLowStock ? 'Ver menos' : `Ver todos (${lowStockProducts.length})`}
                </button>
              )}

              <Link
                to="/admin/products"
                className="mt-3 flex items-center justify-center space-x-2 w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Eye size={16} />
                <span>Ir a Productos</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};