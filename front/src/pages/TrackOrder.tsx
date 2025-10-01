import { useState } from 'react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await orderService.getByOrderNumber(orderNumber.trim());
      setOrder(data);
    } catch (err: any) {
      setError('Pedido no encontrado. Verifica el número ingresado.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      PENDING: {
        label: 'Pendiente',
        icon: Package,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
      },
      CONFIRMED: {
        label: 'Confirmado',
        icon: CheckCircle,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
      },
      SHIPPED: {
        label: 'Enviado',
        icon: Truck,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
      },
      DELIVERED: {
        label: 'Entregado',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      CANCELLED: {
        label: 'Cancelado',
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rastrear Pedido
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de pedido para ver el estado de tu compra
        </p>
      </div>

      <form onSubmit={handleSearch} className="card mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ej: ORD-1234567890-1234"
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Search size={20} />
            <span>{loading ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </form>

      {order && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pedido #{order.orderNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Realizado el{' '}
                  {new Date(order.createdAt).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {(() => {
                const statusInfo = getStatusInfo(order.status);
                const Icon = statusInfo.icon;
                return (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusInfo.bg}`}>
                    <Icon className={statusInfo.color} size={20} />
                    <span className={`font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {[
                  { status: 'PENDING', label: 'Pedido recibido' },
                  { status: 'CONFIRMED', label: 'Pedido confirmado' },
                  { status: 'SHIPPED', label: 'En camino' },
                  { status: 'DELIVERED', label: 'Entregado' },
                ].map((step, index) => {
                  const isActive = 
                    (step.status === 'PENDING') ||
                    (step.status === 'CONFIRMED' && ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status)) ||
                    (step.status === 'SHIPPED' && ['SHIPPED', 'DELIVERED'].includes(order.status)) ||
                    (step.status === 'DELIVERED' && order.status === 'DELIVERED');

                  return (
                    <div key={step.status} className="relative flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isActive ? <CheckCircle size={16} /> : <div className="w-3 h-3 rounded-full bg-current"></div>}
                      </div>
                      <span
                        className={`ml-4 font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="card">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Información del cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Nombre</p>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Teléfono</p>
                <p className="font-medium text-gray-900">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Productos
            </h3>
            <div className="space-y-4 mb-6">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
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
                        Cantidad: {item.quantity} × ${Number(item.productPrice).toFixed(2)}
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
      )}
    </div>
  );
};