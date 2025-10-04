# 🎨 E-commerce Frontend - React + TypeScript

Frontend del E-commerce desarrollado con React, TypeScript, Vite y Tailwind CSS.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura](#-estructura)
- [Rutas](#-rutas)
- [Estado Global](#-estado-global)
- [Componentes](#-componentes)
- [Estilos](#-estilos)
- [Build y Deploy](#-build-y-deploy)

---

## 🚀 Tecnologías

- **Framework:** React 18.x
- **Lenguaje:** TypeScript 5.x
- **Build Tool:** Vite 5.x
- **Routing:** React Router v6
- **Estado Global:** Zustand (con persistencia)
- **Formularios:** React Hook Form
- **Validación:** Zod
- **Estilos:** Tailwind CSS 3.x
- **Iconos:** Lucide React
- **HTTP Client:** Axios
- **Pagos:** Mercado Pago SDK (v2)

---

## ✨ Características

### 🛍️ Para Usuarios
- ✅ Catálogo de productos con filtros
- ✅ Búsqueda y filtrado por categorías
- ✅ Vista detallada de productos con galería de imágenes
- ✅ Carrito de compras persistente (localStorage)
- ✅ Checkout rápido sin registro
- ✅ Pago con tarjeta integrado
- ✅ Confirmación de pedido con número
- ✅ Rastreo de pedidos
- ✅ Página de contacto
- ✅ Diseño responsive

### 👨‍💼 Para Administradores
- ✅ Login con JWT
- ✅ Dashboard con estadísticas
- ✅ Gestión de categorías (CRUD)
- ✅ Gestión de productos (CRUD)
- ✅ Subida de imágenes múltiples
- ✅ Gestión de pedidos
- ✅ Actualización de estados
- ✅ Visualización de detalles

### 🎨 UX/UI
- ✅ Diseño moderno y limpio
- ✅ Animaciones suaves
- ✅ Feedback visual (loading, errores)
- ✅ Toast notifications
- ✅ Modales interactivos
- ✅ Navegación intuitiva
- ✅ Mobile-first

---

## 📦 Requisitos

- Node.js v18 o superior
- npm o yarn
- Backend ejecutándose en `http://localhost:3000`

### Servicios externos:
- Mercado Pago Public Key (para pagos)

---

## 🔧 Instalación

```bash
# Instalar dependencias
npm install
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
VITE_STORE_NAME=TechStore
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-your-public-key-here
```

### Obtener Public Key de Mercado Pago

1. Ve a [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Tus integraciones → Credenciales
3. **Modo Pruebas:** Copia Public Key (TEST-...)
4. **Modo Producción:** Copia Public Key para deploy

---

## 🚀 Ejecución

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Preview de producción

```bash
npm run build
npm run preview
```

---

## 📁 Estructura

```
src/
├── components/              # Componentes reutilizables
│   ├── Loading.tsx         # Spinner de carga
│   ├── Navbar.tsx          # Barra de navegación
│   ├── Footer.tsx          # Pie de página
│   └── ProductCard.tsx     # Tarjeta de producto
│
├── layouts/                 # Layouts de la app
│   ├── MainLayout.tsx      # Layout público
│   └── AdminLayout.tsx     # Layout del admin
│
├── pages/                   # Páginas de la aplicación
│   ├── Home.tsx            # Página principal
│   ├── Products.tsx        # Catálogo de productos
│   ├── ProductDetail.tsx   # Detalle de producto
│   ├── Cart.tsx            # Carrito de compras
│   ├── Checkout.tsx        # Proceso de checkout
│   ├── Payment.tsx         # Formulario de pago
│   ├── OrderConfirmation.tsx # Confirmación
│   ├── TrackOrder.tsx      # Rastreo de pedido
│   ├── Contact.tsx         # Contacto
│   │
│   └── admin/              # Páginas del admin
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminCategories.tsx
│       ├── AdminProducts.tsx
│       ├── AdminProductForm.tsx
│       └── AdminOrders.tsx
│
├── services/                # API calls
│   ├── authService.ts
│   ├── categoryService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── paymentService.ts
│
├── stores/                  # Estado global (Zustand)
│   ├── authStore.ts        # Estado de autenticación
│   └── cartStore.ts        # Estado del carrito
│
├── types/                   # Tipos TypeScript
│   └── index.ts            # Interfaces y enums
│
├── config/                  # Configuración
│   └── api.ts              # Configuración de Axios
│
├── App.tsx                  # Rutas principales
├── main.tsx                 # Punto de entrada
└── index.css                # Estilos globales
```

---

## 🗺️ Rutas

### Rutas Públicas

```typescript
/                           # Home - Productos destacados
/products                   # Catálogo completo
/product/:slug              # Detalle de producto
/cart                       # Carrito de compras
/checkout                   # Proceso de checkout
/payment/:orderId           # Formulario de pago
/order-confirmation/:orderNumber  # Confirmación
/track-order                # Rastreo de pedidos
/contact                    # Contacto
```

### Rutas Admin (Protegidas)

```typescript
/admin/login                # Login del admin
/admin                      # Dashboard
/admin/categories           # Gestión de categorías
/admin/products             # Lista de productos
/admin/products/new         # Crear producto
/admin/products/edit/:id    # Editar producto
/admin/orders               # Gestión de pedidos
```

Todas las rutas `/admin/*` (excepto login) requieren autenticación JWT.

---

## 🔄 Estado Global

### Zustand Stores

#### authStore.ts
```typescript
interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}
```

**Uso:**
```typescript
const { admin, isAuthenticated, login, logout } = useAuthStore();
```

#### cartStore.ts
```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}
```

**Uso:**
```typescript
const { items, addItem, removeItem, getTotal } = useCartStore();
```

**Persistencia:**
- El carrito se guarda automáticamente en `localStorage`
- Se mantiene entre recargas de página
- Se limpia al completar una compra

---

## 🧩 Componentes Principales

### Loading
```typescript
<Loading />
```
Spinner de carga animado.

### Navbar
```typescript
<Navbar />
```
- Logo y nombre de la tienda
- Links de navegación
- Contador del carrito
- Menú hamburguesa (móvil)

### Footer
```typescript
<Footer />
```
- Información de contacto
- Links útiles
- Redes sociales
- Mapa de ubicación

### ProductCard
```typescript
<ProductCard product={product} />
```
Props:
- `product: Product` - Datos del producto

Características:
- Imagen del producto
- Nombre, categoría, precio
- Indicador de stock
- Botón "Agregar al carrito"
- Hover effects

---

## 🎨 Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con clases personalizadas:

#### Botones
```css
.btn                  /* Base button */
.btn-primary          /* Botón primario (azul) */
.btn-secondary        /* Botón secundario (gris) */
.btn-danger           /* Botón de peligro (rojo) */
```

#### Inputs
```css
.input                /* Input base con focus ring */
```

#### Cards
```css
.card                 /* Card con sombra y padding */
```

### Colores Personalizados

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ...
    600: '#0284c7',  // Color principal
    // ...
    900: '#0c4a6e',
  }
}
```

### Responsive Design

Breakpoints de Tailwind:
- `sm:` - 640px (móvil landscape)
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (desktop grande)

---

## 🔌 Servicios (API)

### Configuración de Axios

**config/api.ts**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor: Agrega JWT a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Maneja errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si es ruta admin
    }
    return Promise.reject(error);
  }
);
```

### Servicios disponibles

#### authService
```typescript
authService.login(email, password)
authService.getProfile()
```

#### categoryService
```typescript
categoryService.getAll()
categoryService.getById(id)
categoryService.create(data)
categoryService.update(id, data)
categoryService.delete(id)
```

#### productService
```typescript
productService.getAll(categoryId?, isActive?)
productService.getById(id)
productService.getBySlug(slug)
productService.create(formData)
productService.update(id, formData)
productService.deleteImage(id, imageUrl)
productService.delete(id)
```

#### orderService
```typescript
orderService.create(data)
orderService.getAll(status?)
orderService.getById(id)
orderService.getByOrderNumber(orderNumber)
orderService.updateStatus(id, status)
orderService.delete(id)
```

#### paymentService
```typescript
paymentService.processPayment(data)
paymentService.getPaymentStatus(paymentId)
```

---

## 💳 Integración con Mercado Pago

### Flujo de pago

1. Usuario completa checkout
2. Se crea la orden en el backend
3. Redirige a `/payment/:orderId`
4. SDK de Mercado Pago se carga
5. Usuario ingresa datos de tarjeta
6. Se crea token de tarjeta
7. Se envía al backend para procesar
8. Redirige a confirmación

### Componente Payment

```typescript
// Cargar SDK
<script src="https://sdk.mercadopago.com/js/v2"></script>

// Inicializar
const mp = new window.MercadoPago(publicKey);

// Obtener payment method
const paymentMethods = await mp.getPaymentMethods({
  bin: cardNumber.substring(0, 6)
});

// Crear token
const token = await mp.createCardToken({
  cardNumber,
  cardholderName,
  cardExpirationMonth,
  cardExpirationYear,
  securityCode,
  identificationType,
  identificationNumber,
});

// Procesar pago
await paymentService.processPayment({
  orderId,
  token: token.id,
  paymentMethodId,
  installments: 1,
  payer: {...}
});
```

### Tarjetas de prueba

**Aprobada:**
- Número: `5031 7557 3453 0604`
- Nombre: `APRO`
- CVV: `123`
- Vencimiento: `11/25`
- DNI: `12345678`

**Rechazada:**
- Número: `4509 9535 6623 3704`
- Nombre: `OTHE`
- CVV: `123`
- Vencimiento: `11/25`
- DNI: `12345678`

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build

# Utilidades
npm run lint             # Ejecuta ESLint
```

---

## 🌐 Build y Deploy

### Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

### Deploy en Vercel (Recomendado)

1. **Importar proyecto:**
   - Conectar cuenta de GitHub
   - Seleccionar repositorio
   - Root Directory: `front`

2. **Configuración:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Variables de Entorno:**
   ```
   VITE_API_URL=https://tu-backend.render.com/api
   VITE_STORE_NAME=TechStore
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx (o producción)
   ```

4. **Deploy:**
   - Click en "Deploy"
   - Vercel buildea y deploya automáticamente

### Deploy en Netlify

Similar a Vercel:
1. New site from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Agregar variables de entorno

---

## 🐛 Troubleshooting

### Error: "Cannot connect to API"

**Solución:**
- Verifica que el backend esté corriendo
- Revisa `VITE_API_URL` en `.env`
- Verifica CORS en el backend

### Error: "Mercado Pago SDK not loaded"

**Solución:**
- Verifica conexión a internet
- Revisa consola del navegador
- Recarga la página

### Carrito se vacía al recargar

**Solución:**
- Verifica que Zustand `persist` esté configurado
- Revisa localStorage del navegador (F12 → Application)
- Limpia caché si es necesario

### Imágenes no cargan

**Solución:**
- Verifica URLs de Cloudinary
- Revisa CORS de Cloudinary
- Verifica que las imágenes existan

---

## 🔐 Seguridad

### Mejores prácticas implementadas:

- ✅ Variables de entorno para secretos
- ✅ JWT guardado en localStorage (considerado seguro para SPAs)
- ✅ Validación de formularios con Zod
- ✅ Sanitización de inputs
- ✅ HTTPS en producción
- ✅ Content Security Policy

### Para producción:

- ⚠️ Usar HTTPS siempre
- ⚠️ Configurar CSP headers
- ⚠️ Implementar rate limiting en el backend
- ⚠️ Usar Public Key de producción de Mercado Pago
- ⚠️ Revisar políticas de CORS

---

## 📊 Performance

### Optimizaciones implementadas:

- ✅ Code splitting con React Router
- ✅ Lazy loading de componentes
- ✅ Optimización de imágenes
- ✅ Minificación en build
- ✅ Tree shaking automático con Vite
- ✅ Caché de assets

### Lighthouse Score objetivo:

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## 🎯 Próximas Mejoras

### Funcionalidades pendientes:

- [ ] PWA (Progressive Web App)
- [ ] Búsqueda avanzada con filtros
- [ ] Wishlist (lista de deseos)
- [ ] Reviews de productos
- [ ] Sistema de cupones
- [ ] Chat de soporte
- [ ] Notificaciones push
- [ ] Internacionalización (i18n)
- [ ] Dark mode
- [ ] Comparador de productos

---

## 🧪 Testing

```bash
# Unit tests (si se implementan)
npm run test

# E2E tests (si se implementan)
npm run test:e2e
```

### Herramientas sugeridas:
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** o **Playwright** - E2E testing

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Mercado Pago SDK](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-configuration/card/integrate-via-cardform)

---

## 🤝 Contribuir

Ver [README principal](../README.md) para guías de contribución.

---

## 📝 Notas de Versión

### v1.0.0
- ✅ Catálogo de productos con filtros
- ✅ Carrito persistente
- ✅ Checkout y pago con tarjeta
- ✅ Panel de administración completo
- ✅ Diseño responsive
- ✅ Integración con Mercado Pago