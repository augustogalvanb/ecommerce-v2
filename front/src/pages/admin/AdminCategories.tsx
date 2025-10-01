import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { name: categoryName });
      } else {
        await categoryService.create({ name: categoryName });
      }
      await fetchCategories();
      handleCloseModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await categoryService.delete(id);
      await fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
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
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-2">Gestiona las categorías de productos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Productos
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{category.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{category.slug}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">
                    {category._count?.products || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      disabled={category._count && category._count.products > 0}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="input"
                  placeholder="Ej: Electrónica"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1"
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};