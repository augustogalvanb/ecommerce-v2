import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { Eye, X } from 'lucide-react';

export const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusFilter = searchParams.get('status') as OrderStatus | null;

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll(statusFilter || undefined);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      const updatedOrder = await orderService.updateStatus(orderId, status);
      
      // Actualizar el pedido seleccionado en el modal
      setSelectedOrder(updatedOrder);
      
      // Actualizar la lista de pedidos
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
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
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">Gestiona todos los pedidos de la tienda</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.values(OrderStatus).map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-gray-600 mb-1">{getStatusLabel(status)}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay pedidos disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    N° Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Total
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('es-AR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Información del cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Nombre</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Teléfono</p>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Estado del pedido
                </h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  disabled={updatingStatus}
                  className="input max-w-xs"
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
                {updatingStatus && (
                  <p className="text-sm text-gray-600 mt-2">Actualizando estado...</p>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Productos del pedido
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3"
                    >
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
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="btn btn-secondary w-full"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};