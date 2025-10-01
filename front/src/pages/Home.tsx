import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(undefined, true),
          categoryService.getAll(),
        ]);
        setProducts(productsData.slice(0, 8));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Bienvenido a TechStore
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Descubre los mejores productos tecnológicos al mejor precio. Calidad garantizada y envío a todo el país.
            </p>
            <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center space-x-2">
              <span>Ver todos los productos</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Explora por Categoría
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="card hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category._count?.products || 0} productos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-primary-600" size={32} />
            <h2 className="text-3xl font-bold text-gray-900">
              Productos Destacados
            </h2>
          </div>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Envío a todo el país</h3>
              <p className="text-gray-600">Recibe tu pedido donde estés</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Garantía de calidad</h3>
              <p className="text-gray-600">Productos 100% originales</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Pago seguro</h3>
              <p className="text-gray-600">Múltiples métodos de pago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};