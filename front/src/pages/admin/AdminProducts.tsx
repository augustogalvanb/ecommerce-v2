import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productService.delete(id);
      await fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">Gestiona el catálogo de productos</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/100'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{product.category?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        product.stock > 10
                          ? 'text-green-600'
                          : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      } font-medium`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Eye size={16} />
                        <span className="text-sm">Activo</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-gray-400">
                        <EyeOff size={16} />
                        <span className="text-sm">Inactivo</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};