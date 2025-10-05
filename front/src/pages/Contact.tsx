import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactService } from '../services/contactService';

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'El asunto es requerido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.sendMessage(data);
      setSuccess(true);
      reset();
      
      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@techstore.com</p>
                <p className="text-gray-600">soporte@techstore.com</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600">+54 381 123-4567</p>
                <p className="text-gray-600">+54 381 765-4321</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Dirección</h3>
                <p className="text-gray-600">Av. Mate de Luna 1000</p>
                <p className="text-gray-600">San Miguel de Tucumán</p>
                <p className="text-gray-600">Tucumán, Argentina (4000)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Horario de atención</h3>
                <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                <p className="text-gray-600">Sábados: 9:00 - 13:00</p>
                <p className="text-gray-600">Domingos: Cerrado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Envíanos un mensaje
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-green-800 font-medium">¡Mensaje enviado correctamente!</p>
                <p className="text-green-700 text-sm mt-1">
                  Te responderemos a la brevedad en tu email.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                {...register('name')}
                type="text"
                className="input"
                placeholder="Tu nombre"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="tu@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto *
              </label>
              <input
                {...register('subject')}
                type="text"
                className="input"
                placeholder="¿En qué podemos ayudarte?"
                disabled={loading}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                {...register('message')}
                className="input min-h-[150px] resize-none"
                placeholder="Escribe tu mensaje aquí..."
                disabled={loading}
              ></textarea>
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.3681561062235!2d-65.2212824252806!3d-26.828240289678277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c6bbf9e8ab9%3A0x886f1c58ad739b2e!2sAv.%20Mate%20de%20Luna%201000%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1759617912096!5m2!1ses-419!2sar"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};