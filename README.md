# 🛒 E-commerce Full Stack - TechStore

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

E-commerce completo y funcional con panel de administración, procesamiento de pagos mediante Mercado Pago y envío automático de facturas por email.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Vista Previa](#-vista-previa)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deployment](#-deployment)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🛍️ Para Usuarios (Público)
- ✅ Catálogo de productos con filtros por categoría
- ✅ Vista detallada de productos con múltiples imágenes
- ✅ Carrito de compras persistente (localStorage)
- ✅ Checkout como usuario invitado (sin registro)
- ✅ Pago con tarjeta integrado (Mercado Pago Checkout API)
- ✅ Confirmación de pedido con número de seguimiento
- ✅ Rastreo de pedidos por número
- ✅ Recepción de factura por email (PDF adjunto)
- ✅ Diseño responsive y moderno

### 👨‍💼 Para Administradores
- ✅ Panel de administración completo
- ✅ Login con JWT
- ✅ CRUD de categorías
- ✅ CRUD de productos con carga de imágenes (Cloudinary)
- ✅ Gestión de pedidos con cambio de estados
- ✅ Dashboard con estadísticas
- ✅ Visualización de información de clientes

### 🔧 Técnicas
- ✅ API RESTful con NestJS
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Autenticación JWT
- ✅ Validación de datos con class-validator y zod
- ✅ Subida de imágenes a Cloudinary
- ✅ Generación de PDFs con PDFKit
- ✅ Envío de emails con Nodemailer
- ✅ Integración con Mercado Pago
- ✅ TypeScript en todo el stack

---

## 🚀 Tecnologías

### Backend
- **Framework:** NestJS 10.x
- **Lenguaje:** TypeScript 5.x
- **Base de Datos:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Autenticación:** JWT (Passport)
- **Validación:** class-validator
- **Pagos:** Mercado Pago SDK
- **Emails:** Nodemailer
- **PDFs:** PDFKit
- **Storage:** Cloudinary

### Frontend
- **Framework:** React 18.x
- **Lenguaje:** TypeScript 5.x
- **Build Tool:** Vite 5.x
- **Routing:** React Router v6
- **Estado Global:** Zustand
- **Formularios:** React Hook Form
- **Validación:** Zod
- **Estilos:** Tailwind CSS 3.x
- **Iconos:** Lucide React
- **HTTP Client:** Axios

---

## 🖼️ Vista Previa

### Usuario Final
```
┌─────────────────────────────────────────┐
│  🏠 Home → Productos Destacados         │
│  📦 Productos → Catálogo Completo       │
│  🛒 Carrito → Checkout → 💳 Pago       │
│  📧 Email con Factura PDF               │
│  🔍 Rastreo de Pedido                   │
└─────────────────────────────────────────┘
```

### Panel Admin
```
┌─────────────────────────────────────────┐
│  📊 Dashboard → Estadísticas            │
│  📁 Categorías → CRUD                   │
│  📦 Productos → CRUD + Imágenes         │
│  🛍️ Pedidos → Gestión + Estados        │
└─────────────────────────────────────────┘
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (v15 o superior)
- **Git**

### Cuentas necesarias:
- **Cloudinary** (para almacenar imágenes)
- **Mercado Pago** (para procesar pagos)
- **Gmail** u otro servicio SMTP (para enviar emails)

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Instalar dependencias del Backend

```bash
cd back
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../front
npm install
```

---

## ⚙️ Configuración

### Backend (.env)

Crea un archivo `.env` en la carpeta `back/` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db?schema=public"

# JWT
JWT_SECRET="tu-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-tu-access-token-de-prueba"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-app-password-de-gmail"
EMAIL_FROM="TechStore <tu-email@gmail.com>"

# App
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

#### 📝 Notas sobre las credenciales:

**Cloudinary:**
1. Regístrate en [cloudinary.com](https://cloudinary.com)
2. Obtén tus credenciales en Dashboard → Account Details

**Mercado Pago:**
1. Crea una cuenta en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Ve a "Tus integraciones" → "Credenciales"
3. Usa el **Access Token de prueba** para desarrollo
4. Usa el **Access Token de producción** para deploy

**Gmail App Password:**
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (activar)
3. Contraseñas de aplicaciones → Generar nueva
4. Usa esa contraseña en `EMAIL_PASSWORD`

### Frontend (.env)

Crea un archivo `.env` en la carpeta `front/` con:

```env
VITE_API_URL=http://localhost:3000/api
VITE_STORE_NAME=TechStore
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-de-mercado-pago
```

---

## 🎯 Uso

### 1. Configurar base de datos

```bash
cd back

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate

# Cargar datos de prueba (admin + productos)
npm run prisma:seed
```

### 2. Iniciar el Backend

```bash
cd back
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

### 3. Iniciar el Frontend

En otra terminal:

```bash
cd front
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 4. Credenciales de Admin

Después de ejecutar el seed:

- **Email:** `admin@ecommerce.com`
- **Contraseña:** `admin123`

Accede al panel admin en: `http://localhost:5173/admin/login`

### 5. Tarjetas de prueba (Mercado Pago)

Para probar pagos en desarrollo:

**Tarjeta aprobada:**
- Número: `5031 7557 3453 0604`
- Nombre: `APRO`
- CVV: `123`
- Vencimiento: Cualquier fecha futura
- DNI: `12345678`

**Tarjeta rechazada:**
- Número: `4509 9535 6623 3704`
- Nombre: `OTHE`
- CVV: `123`
- Vencimiento: Cualquier fecha futura
- DNI: `12345678`

Más tarjetas de prueba: [Docs Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing)

---

## 📁 Estructura del Proyecto

```
ecommerce-fullstack/
├── back/                       # Backend (NestJS)
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de la base de datos
│   │   └── seed.ts            # Script de seed
│   ├── src/
│   │   ├── auth/              # Autenticación JWT
│   │   ├── categories/        # CRUD Categorías
│   │   ├── products/          # CRUD Productos
│   │   ├── orders/            # CRUD Pedidos
│   │   ├── mercadopago/       # Integración Mercado Pago
│   │   ├── email/             # Envío de emails
│   │   ├── cloudinary/        # Subida de imágenes
│   │   ├── prisma/            # Servicio Prisma
│   │   └── main.ts            # Punto de entrada
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── front/                     # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── layouts/           # Layouts (Main, Admin)
│   │   ├── pages/             # Páginas de la app
│   │   │   ├── admin/         # Páginas del admin
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   └── Payment.tsx
│   │   ├── services/          # API calls
│   │   ├── stores/            # Estado global (Zustand)
│   │   ├── types/             # Tipos TypeScript
│   │   ├── config/            # Configuración (axios)
│   │   └── App.tsx            # Rutas principales
│   ├── .env                   # Variables de entorno
│   └── package.json
│
└── README.md                  # Este archivo
```

---

## 📜 Scripts Disponibles

### Backend

```bash
# Desarrollo
npm run start:dev          # Inicia el servidor en modo desarrollo

# Prisma
npm run prisma:generate    # Genera el cliente de Prisma
npm run prisma:migrate     # Ejecuta migraciones
npm run prisma:studio      # Abre Prisma Studio (GUI)
npm run prisma:seed        # Ejecuta el seed
npm run prisma:reset       # Resetea la BD y ejecuta seed

# Producción
npm run build              # Compila el proyecto
npm run start:prod         # Inicia el servidor en producción
```

### Frontend

```bash
# Desarrollo
npm run dev                # Inicia el servidor de desarrollo

# Producción
npm run build              # Compila para producción
npm run preview            # Preview del build de producción

# Utilidades
npm run lint               # Ejecuta el linter
```

---

## 🌐 Deployment

### Backend (Render)

1. Crea una cuenta en [render.com](https://render.com)
2. Crea un nuevo **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Root Directory:** `back`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
5. Agrega las variables de entorno del `.env`
6. Crea una **PostgreSQL Database** en Render
7. Copia la `DATABASE_URL` a las variables de entorno

### Frontend (Vercel)

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Importa tu repositorio
3. Configura:
   - **Root Directory:** `front`
   - **Framework Preset:** Vite
4. Agrega las variables de entorno:
   - `VITE_API_URL`: URL de tu backend en Render
   - `VITE_MERCADOPAGO_PUBLIC_KEY`: Public Key de producción
5. Deploy

### Variables de Producción

Recuerda cambiar:
- ✅ JWT_SECRET (usar uno más seguro)
- ✅ MERCADOPAGO_ACCESS_TOKEN (usar token de producción)
- ✅ VITE_MERCADOPAGO_PUBLIC_KEY (usar public key de producción)
- ✅ DATABASE_URL (usar BD de producción)
- ✅ FRONTEND_URL (usar URL de Vercel)

---

## 🎨 Funcionalidades Detalladas

### Sistema de Pagos
- Integración completa con Mercado Pago Checkout API
- Procesamiento de pagos con tarjeta directamente en la app
- Validación de tarjetas en tiempo real
- Manejo de estados de pago (aprobado, rechazado, pendiente)
- Actualización automática del stock después del pago

### Gestión de Pedidos
- Generación automática de número de pedido único
- Estados de pedido: Pendiente, Confirmado, Enviado, Entregado, Cancelado
- Rastreo público de pedidos por número
- Timeline visual del estado del pedido
- Descuento automático de stock al crear pedido
- Devolución de stock al cancelar pedidos pendientes

### Sistema de Emails
- Envío automático de confirmación al completar compra
- Factura en PDF adjunta profesional
- Template responsive compatible con Gmail, Outlook, etc.
- Información detallada del pedido y productos
- Link directo para rastrear el pedido

### Gestión de Imágenes
- Subida múltiple de imágenes por producto
- Almacenamiento en Cloudinary
- Eliminación de imágenes individuales
- Optimización automática de imágenes
- Galería de imágenes en detalle de producto

### Panel de Administración
- Dashboard con estadísticas en tiempo real
- Gestión completa de productos (CRUD)
- Gestión de categorías
- Gestión de pedidos con filtros por estado
- Vista detallada de cada pedido
- Actualización de estado de pedidos
- Protección de rutas con JWT

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [Mercado Pago](https://www.mercadopago.com.ar/developers)
- [Cloudinary](https://cloudinary.com/)
- [Unsplash](https://unsplash.com/) - Imágenes de productos