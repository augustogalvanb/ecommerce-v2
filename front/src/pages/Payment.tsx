import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useCartStore } from '../stores/cartStore';
import { CreditCard, Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export const Payment = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos en segundos

  // Obtener datos desde location.state o localStorage
  const orderNumber = location.state?.orderNumber;
  const customerEmail = location.state?.customerEmail;
  const customerName = location.state?.customerName;
  const totalAmount = location.state?.totalAmount;

  // Datos del formulario
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('APRO');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [identificationType, setIdentificationType] = useState('DNI');
  const [identificationNumber, setIdentificationNumber] = useState('');

  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

  // Timer countdown
  useEffect(() => {
    // Verificar si hay una orden pendiente guardada
    const pendingOrder = localStorage.getItem('pending_order');
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);
      const createdAt = new Date(orderData.createdAt);
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
      const remaining = 600 - elapsedSeconds;

      if (remaining <= 0) {
        setError('El tiempo para completar el pago ha expirado. Por favor, crea un nuevo pedido.');
        setTimeLeft(0);
        return;
      }

      setTimeLeft(remaining);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('El tiempo para completar el pago ha expirado. Por favor, crea un nuevo pedido.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Verificar que tenemos la public key
    if (!publicKey) {
      setError('Error de configuración: No se encontró la Public Key de Mercado Pago');
      return;
    }
    
    console.log('Public Key configurada:', publicKey.substring(0, 10) + '...');
    
    // Redirigir si no hay datos de la orden
    if (!orderId || !orderNumber) {
      navigate('/cart');
      return;
    }
    
    loadMercadoPagoScript();
  }, [orderId, orderNumber, navigate, publicKey]);

  const loadMercadoPagoScript = () => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log('Mercado Pago SDK loaded');
    };
    document.body.appendChild(script);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId) return;

    // Verificar si el tiempo expiró
    if (timeLeft <= 0) {
      setError('El tiempo para completar el pago ha expirado. Por favor, crea un nuevo pedido.');
      return;
    }

    // Validaciones antes de procesar
    if (cardNumber.replace(/\s/g, '').length < 15) {
      setError('El número de tarjeta es inválido');
      return;
    }

    if (expirationDate.length !== 5 || !expirationDate.includes('/')) {
      setError('La fecha de vencimiento es inválida. Formato: MM/AA');
      return;
    }

    if (securityCode.length < 3) {
      setError('El CVV es inválido');
      return;
    }

    if (identificationNumber.length < 7) {
      setError('El número de documento es inválido');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Verificar que el SDK está cargado
      if (!window.MercadoPago) {
        throw new Error('SDK de Mercado Pago no cargado. Recarga la página e intenta nuevamente.');
      }

      const mp = new window.MercadoPago(publicKey);

      console.log('Creando token de tarjeta...');

      const [month, year] = expirationDate.split('/');
      const cleanCardNumber = cardNumber.replace(/\s/g, '');

      // Obtener el método de pago
      const paymentMethods = await mp.getPaymentMethods({
        bin: cleanCardNumber.substring(0, 6)
      });

      console.log('Métodos de pago encontrados:', paymentMethods);

      if (!paymentMethods.results || paymentMethods.results.length === 0) {
        throw new Error('No se pudo identificar el tipo de tarjeta. Verifica el número ingresado.');
      }

      const paymentMethodId = paymentMethods.results[0].id;
      console.log('Payment Method ID:', paymentMethodId);

      // Crear token de la tarjeta
      const cardTokenResponse = await mp.createCardToken({
        cardNumber: cleanCardNumber,
        cardholderName: cardHolder,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: securityCode,
        identificationType: identificationType,
        identificationNumber: identificationNumber,
      });

      console.log('Token creado:', cardTokenResponse);

      if (!cardTokenResponse || !cardTokenResponse.id) {
        throw new Error('No se pudo crear el token de la tarjeta. Verifica los datos ingresados.');
      }

      console.log('Procesando pago...');

      const paymentData = {
        orderId: orderId,
        token: cardTokenResponse.id,
        paymentMethodId: paymentMethodId,
        installments: 1,
        payer: {
          email: customerEmail || 'test@test.com',
          identification: {
            type: identificationType,
            number: identificationNumber,
          },
        },
      };

      console.log('Datos de pago:', paymentData);

      const response = await paymentService.processPayment(paymentData);

      console.log('Respuesta del pago:', response);

      if (response.success) {
        // Limpiar carrito cuando el pago es exitoso
        clearCart();
        // Limpiar orden pendiente de localStorage
        localStorage.removeItem('pending_order');
        
        setSuccess(true);
        setTimeout(() => {
          navigate(`/order-confirmation/${orderNumber}`);
        }, 2000);
      } else {
        setError(
          `Pago rechazado: ${response.statusDetail || 'Intenta con otra tarjeta'}`
        );
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al procesar el pago. ';
      
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += 'Por favor verifica los datos de tu tarjeta e intenta nuevamente.';
      }
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Redirigir si no hay datos
  if (!orderId || !orderNumber) {
    return null;
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h2>
        <p className="text-gray-600 mb-4">
          Tu pago ha sido procesado correctamente. Recibirás un email con la factura.
        </p>
        <p className="text-gray-600 mb-4">
          Serás redirigido en un momento...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Datos de Pago</h1>
        <p className="text-gray-600">Ingresa los datos de tu tarjeta de forma segura</p>
      </div>

      {/* Timer */}
      <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
        timeLeft < 120 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Clock className={timeLeft < 120 ? 'text-red-600' : 'text-blue-600'} size={20} />
          <span className={`font-medium ${timeLeft < 120 ? 'text-red-900' : 'text-blue-900'}`}>
            Tiempo restante para completar el pago:
          </span>
        </div>
        <span className={`text-2xl font-bold ${timeLeft < 120 ? 'text-red-600' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <Lock size={20} />
              <span className="text-sm font-medium">Pago 100% seguro con Mercado Pago</span>
            </div>

            {error && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                💳 Tarjetas de prueba para testing:
              </p>
              <div className="space-y-1 text-xs text-blue-800">
                <p><strong>Mastercard (Aprobado):</strong> 5031 7557 3453 0604</p>
                <p><strong>Visa (Rechazado):</strong> 4509 9535 6623 3704</p>
                <p><strong>Nombre:</strong> APRO (aprobar) u OTHE (rechazar)</p>
                <p><strong>CVV:</strong> 123 | <strong>Vencimiento:</strong> Cualquier fecha futura</p>
                <p><strong>DNI:</strong> 12345678</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de tarjeta *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="input pl-12"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  disabled={processing || timeLeft <= 0}
                />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del titular *
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                className="input"
                placeholder="JUAN PEREZ"
                required
                disabled={processing || timeLeft <= 0}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimiento *
                </label>
                <input
                  type="text"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(formatExpirationDate(e.target.value))}
                  className="input"
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                  disabled={processing || timeLeft <= 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  className="input"
                  placeholder="123"
                  maxLength={4}
                  required
                  disabled={processing || timeLeft <= 0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de documento *
                </label>
                <select
                  value={identificationType}
                  onChange={(e) => setIdentificationType(e.target.value)}
                  className="input"
                  required
                  disabled={processing || timeLeft <= 0}
                >
                  <option value="DNI">DNI</option>
                  <option value="CI">CI</option>
                  <option value="LC">LC</option>
                  <option value="LE">LE</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de documento *
                </label>
                <input
                  type="text"
                  value={identificationNumber}
                  onChange={(e) => setIdentificationNumber(e.target.value.replace(/\D/g, ''))}
                  className="input"
                  placeholder="12345678"
                  required
                  disabled={processing || timeLeft <= 0}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || timeLeft <= 0}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {processing ? 'Procesando pago...' : timeLeft <= 0 ? 'Tiempo expirado' : `Pagar ${totalAmount ? `$${Number(totalAmount).toFixed(2)}` : ''}`}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Al hacer clic en "Pagar", aceptas nuestros términos y condiciones
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pedido:</span>
                <span className="font-mono font-medium text-xs">{orderNumber}</span>
              </div>
              {customerName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{customerName}</span>
                </div>
              )}
            </div>

            {totalAmount && (
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${Number(totalAmount).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};