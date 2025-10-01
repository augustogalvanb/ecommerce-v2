import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types';
import { Loading } from '../components/Loading';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCart, Minus, Plus, ArrowLeft, Package } from 'lucide-react';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const data = await productService.getBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <Loading />;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Producto no encontrado
        </h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-primary-600 font-medium mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-5xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Package size={20} />
              <span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    En stock ({product.stock} unidades disponibles)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Sin stock</span>
                )}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={24} />
                <span>Agregar al carrito</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};