import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/orderService';

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
  const [isProcessing, setIsProcessing] = useState(false); // Nuevo flag

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  // Solo redirigir si el carrito está vacío Y NO estamos procesando
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items.length, navigate, isProcessing]);

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    setIsProcessing(true); // Activar flag antes de limpiar carrito
    
    try {
      const orderData = {
        ...data,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await orderService.create(orderData);
      clearCart(); // Ahora sí limpiamos el carrito
      
      // Navegar directamente sin esperar
      navigate(`/order-confirmation/${order.orderNumber}`, { replace: true });
    } catch (error: any) {
      setIsProcessing(false); // Desactivar flag si hay error
      alert(error.response?.data?.message || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  // No mostrar nada si el carrito está vacío y no estamos procesando
  if (items.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Guarda el número de pedido que recibirás para rastrear tu compra.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Procesando pedido...' : 'Confirmar pedido'}
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