import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Loading } from '../components/Loading';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';

export const OrderConfirmation = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const data = await orderService.getByOrderNumber(orderNumber);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) return <Loading />;
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pedido no encontrado
        </h2>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-gray-600">
          Gracias por tu compra. Hemos recibido tu pedido correctamente.
        </p>
      </div>

      <div className="card mb-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg text-gray-900 mb-2">
            Número de Pedido
          </h2>
          <p className="text-3xl font-bold text-primary-600">
            {order.orderNumber}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Guarda este número para rastrear tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Información de contacto
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">Nombre:</span>
                <span>{order.customerName}</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} />
                <span>{order.customerEmail}</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>{order.customerPhone}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Estado del pedido
            </h3>
            <div className="flex items-center space-x-2">
              <Package className="text-yellow-600" size={20} />
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Productos del pedido
          </h3>
          <div className="space-y-3 mb-6">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.product?.images[0] || 'https://via.placeholder.com/100'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ${Number(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          Próximos pasos
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Recibirás un email de confirmación en {order.customerEmail}</li>
          <li>• Puedes rastrear tu pedido usando el número proporcionado</li>
          <li>• Nos pondremos en contacto contigo para coordinar la entrega</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/track-order" className="btn btn-primary flex-1">
          Rastrear mi pedido
        </Link>
        <Link to="/products" className="btn btn-secondary flex-1">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};