import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const Contact = () => {
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
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                className="input"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto *
              </label>
              <input
                type="text"
                className="input"
                placeholder="¿En qué podemos ayudarte?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                className="input min-h-[150px] resize-none"
                placeholder="Escribe tu mensaje aquí..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3">
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56723.64624287394!2d-65.24978784863281!3d-26.808284999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f1d%3A0xf8606cd659b8e3e4!2zU2FuIE1pZ3VlbCBkZSBUdWN1bcOhbiwgVHVjdW3DoW4!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
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