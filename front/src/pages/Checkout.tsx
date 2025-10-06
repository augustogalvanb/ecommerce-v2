import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/orderService';
import { ArrowRight } from 'lucide-react';

const checkoutSchema = z.object({
  customerName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items.length, navigate, isProcessing]);

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    setIsProcessing(true);
    
    try {
      const orderData = {
        ...data,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.create(orderData);
      setOrderId(order.id);

      // Guardar orderId en localStorage para poder volver a la página de pago
      localStorage.setItem('pending_order', JSON.stringify({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        totalAmount: order.totalAmount,
        createdAt: new Date().toISOString(),
      }));
      
      // Navegar a la página de pago
      navigate(`/payment/${order.id}`, { 
        state: { 
          orderNumber: order.orderNumber,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          totalAmount: order.totalAmount,
        } 
      });
    } catch (error: any) {
      setIsProcessing(false);
      alert(error.response?.data?.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Completa tus datos para continuar con el pago</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Información de contacto
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                {...register('customerName')}
                type="text"
                className="input"
                placeholder="Juan Pérez"
                disabled={loading}
              />
              {errors.customerName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('customerEmail')}
                type="email"
                className="input"
                placeholder="juan@ejemplo.com"
                disabled={loading}
              />
              {errors.customerEmail && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                {...register('customerPhone')}
                type="tel"
                className="input"
                placeholder="+54 381 123-4567"
                disabled={loading}
              />
              {errors.customerPhone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerPhone.message}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Siguiente paso:</strong> Después de confirmar tus datos, podrás ingresar la información de tu tarjeta de forma segura.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Creando pedido...' : 'Continuar al pago'}</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen del pedido
            </h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      x{item.quantity} - ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};