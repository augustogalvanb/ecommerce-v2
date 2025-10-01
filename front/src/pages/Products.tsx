import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { Filter } from 'lucide-react';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll(
          selectedCategory || undefined,
          true
        );
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestros Productos
        </h1>
        <p className="text-gray-600">
          Explora nuestra amplia selección de productos tecnológicos
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card sticky top-24">
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h2 className="font-bold text-lg">Filtros</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => handleCategoryChange('')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Todas</span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">
                        {category.name}
                        <span className="text-gray-500 text-sm ml-1">
                          ({category._count?.products || 0})
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No se encontraron productos en esta categoría.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Mostrando {products.length} productos
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};