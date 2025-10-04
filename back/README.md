# 🔧 E-commerce Backend - API RESTful

Backend del E-commerce desarrollado con NestJS, Prisma, PostgreSQL y TypeScript.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Base de Datos](#-base-de-datos)
- [Ejecución](#-ejecución)
- [Endpoints](#-endpoints)
- [Arquitectura](#-arquitectura)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## 🚀 Tecnologías

- **Framework:** NestJS 10.x
- **Lenguaje:** TypeScript 5.x
- **Base de Datos:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Autenticación:** JWT (Passport)
- **Validación:** class-validator, class-transformer
- **Pagos:** Mercado Pago SDK
- **Emails:** Nodemailer
- **PDFs:** PDFKit
- **Storage:** Cloudinary
- **Password:** bcrypt

---

## ✨ Características

### Autenticación & Seguridad
- ✅ Autenticación con JWT
- ✅ Guards para proteger rutas
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos con DTOs
- ✅ CORS configurado

### Gestión de Productos
- ✅ CRUD completo de productos
- ✅ Subida múltiple de imágenes a Cloudinary
- ✅ Eliminación individual de imágenes
- ✅ Filtrado por categoría y estado
- ✅ Búsqueda por slug
- ✅ Gestión de stock automática

### Gestión de Pedidos
- ✅ Creación de pedidos sin autenticación
- ✅ Generación automática de número de pedido
- ✅ Descuento automático de stock
- ✅ Estados de pedido (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- ✅ Estados de pago (PENDING, APPROVED, REJECTED, etc.)
- ✅ Rastreo público por número de pedido
- ✅ Panel admin para gestión completa

### Pagos
- ✅ Integración con Mercado Pago Checkout API
- ✅ Procesamiento de pagos con tarjeta
- ✅ Tokenización segura de tarjetas
- ✅ Webhooks de Mercado Pago (preparado)
- ✅ Actualización automática de estado

### Emails
- ✅ Envío automático de confirmación
- ✅ Generación de factura en PDF
- ✅ Template HTML responsive
- ✅ Compatible con Gmail, Outlook, etc.

---

## 📦 Requisitos

- Node.js v18 o superior
- PostgreSQL v15 o superior
- npm o yarn

### Cuentas de servicios externos:
- [Cloudinary](https://cloudinary.com) - Almacenamiento de imágenes
- [Mercado Pago](https://www.mercadopago.com.ar/developers) - Procesamiento de pagos
- Gmail u otro SMTP - Envío de emails

---

## 🔧 Instalación

```bash
# Instalar dependencias
npm install
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-your-access-token-here"

# Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"
EMAIL_FROM="TechStore <your-email@gmail.com>"

# App
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Obtener credenciales

#### Cloudinary
1. Regístrate en [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copia: Cloud Name, API Key, API Secret

#### Mercado Pago
1. Cuenta en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Tus integraciones → Credenciales
3. Modo **Pruebas**: Copia Access Token (APP_USR-...)
4. Modo **Producción**: Copia Access Token para deploy

#### Gmail App Password
1. Cuenta de Google → Seguridad
2. Verificación en 2 pasos → Activar
3. Contraseñas de aplicaciones → Generar
4. Usa esa contraseña en `EMAIL_PASSWORD`

---

## 🗄️ Base de Datos

### Ejecutar migraciones

```bash
# Crear base de datos y aplicar migraciones
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate
```

### Seed (Datos de prueba)

El seed carga automáticamente:
- ✅ 1 Admin (admin@ecommerce.com / admin123)
- ✅ 4 Categorías (Laptops, Smartphones, Auriculares, Accesorios)
- ✅ 8 Productos con imágenes (subidas a Cloudinary)

```bash
# Ejecutar seed
npm run prisma:seed
```

### Resetear base de datos

```bash
# Elimina todo, recrea, migra y ejecuta seed
npx prisma migrate reset

# Sin confirmación (para scripts)
npx prisma migrate reset --force
```

### Prisma Studio (GUI)

```bash
# Abrir interfaz visual de la BD
npx prisma studio
```

Accesible en: `http://localhost:5555`

---

## 🚀 Ejecución

### Desarrollo

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000`

### Producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

---

## 📡 Endpoints

### Autenticación

#### POST `/api/auth/login`
Login de administrador

**Body:**
```json
{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "email": "admin@ecommerce.com",
    "name": "Administrador"
  }
}
```

#### GET `/api/auth/me`
Obtener perfil del admin (requiere JWT)

**Headers:**
```
Authorization: Bearer {token}
```

---

### Categorías

#### GET `/api/categories`
Listar todas las categorías (público)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Laptops",
    "slug": "laptops",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "_count": {
      "products": 5
    }
  }
]
```

#### GET `/api/categories/:id`
Obtener categoría por ID con sus productos (público)

#### GET `/api/categories/slug/:slug`
Obtener categoría por slug (público)

#### POST `/api/categories`
Crear categoría (requiere JWT)

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Nueva Categoría"
}
```

#### PATCH `/api/categories/:id`
Actualizar categoría (requiere JWT)

#### DELETE `/api/categories/:id`
Eliminar categoría (requiere JWT)
- ⚠️ No se puede eliminar si tiene productos asociados

---

### Productos

#### GET `/api/products`
Listar productos (público)

**Query Params:**
- `categoryId` (opcional): Filtrar por categoría
- `isActive` (opcional): true/false

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "MacBook Pro 14\"",
    "slug": "macbook-pro-14",
    "description": "Laptop profesional...",
    "price": 2499.99,
    "stock": 15,
    "images": ["https://res.cloudinary.com/..."],
    "isActive": true,
    "categoryId": "uuid",
    "category": {
      "id": "uuid",
      "name": "Laptops",
      "slug": "laptops"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/products/:id`
Obtener producto por ID (público)

#### GET `/api/products/slug/:slug`
Obtener producto por slug (público)

#### POST `/api/products`
Crear producto con imágenes (requiere JWT)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
name: "Producto Nuevo"
description: "Descripción del producto"
price: 999.99
stock: 10
categoryId: "uuid"
isActive: true
images: [File, File, ...] (hasta 10 imágenes)
```

#### PATCH `/api/products/:id`
Actualizar producto (requiere JWT)

#### DELETE `/api/products/:id/image`
Eliminar imagen específica (requiere JWT)

**Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

#### DELETE `/api/products/:id`
Eliminar producto (requiere JWT)
- ⚠️ Elimina también las imágenes de Cloudinary

---

### Pedidos

#### POST `/api/orders`
Crear pedido (público)

**Body:**
```json
{
  "customerName": "Juan Pérez",
  "customerEmail": "juan@example.com",
  "customerPhone": "+54 381 123-4567",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-1234567890-1234",
  "customerName": "Juan Pérez",
  "customerEmail": "juan@example.com",
  "customerPhone": "+54 381 123-4567",
  "totalAmount": 4999.98,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "orderItems": [...],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### GET `/api/orders`
Listar pedidos (requiere JWT)

**Query Params:**
- `status` (opcional): PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED

#### GET `/api/orders/number/:orderNumber`
Obtener pedido por número (público)

#### GET `/api/orders/:id`
Obtener pedido por ID (requiere JWT)

#### PATCH `/api/orders/:id/status`
Actualizar estado del pedido (requiere JWT)

**Body:**
```json
{
  "status": "CONFIRMED"
}
```

Estados válidos:
- `PENDING` - Pendiente
- `CONFIRMED` - Confirmado
- `SHIPPED` - Enviado
- `DELIVERED` - Entregado
- `CANCELLED` - Cancelado

#### DELETE `/api/orders/:id`
Eliminar pedido (requiere JWT)
- ⚠️ Si está en PENDING, devuelve el stock

---

### Pagos

#### POST `/api/payments/process`
Procesar pago con Mercado Pago (público)

**Body:**
```json
{
  "orderId": "uuid",
  "token": "card_token_from_mercadopago_sdk",
  "paymentMethodId": "master",
  "installments": 1,
  "payer": {
    "email": "customer@example.com",
    "identification": {
      "type": "DNI",
      "number": "12345678"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "status": "approved",
  "statusDetail": "accredited",
  "paymentId": "1234567890",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-...",
    "status": "CONFIRMED",
    "paymentStatus": "APPROVED",
    ...
  }
}
```

Estados de pago:
- `PENDING` - Pendiente
- `APPROVED` - Aprobado
- `REJECTED` - Rechazado
- `IN_PROCESS` - En proceso
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

#### GET `/api/payments/status/:paymentId`
Consultar estado de pago en Mercado Pago (público)

---

## 🏗️ Arquitectura

### Estructura de módulos

```
src/
├── auth/                    # Autenticación JWT
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── categories/              # Gestión de categorías
│   ├── dto/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
│
├── products/                # Gestión de productos
│   ├── dto/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
│
├── orders/                  # Gestión de pedidos
│   ├── dtos/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
│
├── mercadopago/            # Integración Mercado Pago
│   ├── dto/
│   ├── mercadopago.controller.ts
│   ├── mercadopago.service.ts
│   └── mercadopago.module.ts
│
├── email/                  # Envío de emails
│   ├── email.service.ts
│   └── email.module.ts
│
├── cloudinary/             # Subida de imágenes
│   ├── cloudinary.provider.ts
│   ├── cloudinary.service.ts
│   └── cloudinary.module.ts
│
├── prisma/                 # ORM
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── app.module.ts           # Módulo principal
└── main.ts                 # Punto de entrada
```

### Prisma Schema

```prisma
model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  slug      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]
}

model Product {
  id          String      @id @default(uuid())
  name        String
  slug        String      @unique
  description String
  price       Decimal
  stock       Int
  images      String[]
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id            String        @id @default(uuid())
  orderNumber   String        @unique
  customerName  String
  customerEmail String
  customerPhone String
  totalAmount   Decimal
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  paymentId     String?
  paymentMethod String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  orderItems    OrderItem[]
}

model OrderItem {
  id           String  @id @default(uuid())
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id])
  productId    String
  product      Product @relation(fields: [productId], references: [id])
  productName  String
  productPrice Decimal
  quantity     Int
  subtotal     Decimal
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
  IN_PROCESS
  CANCELLED
  REFUNDED
}
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start              # Inicia en modo normal
npm run start:dev          # Inicia con hot-reload
npm run start:debug        # Inicia en modo debug

# Build
npm run build              # Compila el proyecto

# Producción
npm run start:prod         # Inicia versión compilada

# Prisma
npm run prisma:generate    # Genera cliente de Prisma
npm run prisma:migrate     # Ejecuta migraciones
npm run prisma:studio      # Abre Prisma Studio
npm run prisma:seed        # Ejecuta seed
npm run prisma:reset       # Resetea BD + seed

# Linting
npm run lint               # Ejecuta ESLint
npm run format             # Formatea código con Prettier

# Testing
npm run test               # Unit tests
npm run test:watch         # Tests en modo watch
npm run test:cov           # Coverage
npm run test:e2e           # E2E tests
```

---

## 🌐 Deployment

### Render.com (Recomendado)

1. **Crear PostgreSQL Database:**
   - New → PostgreSQL
   - Copia la `Internal Database URL`

2. **Crear Web Service:**
   - New → Web Service
   - Conectar repositorio GitHub
   - Root Directory: `back`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`

3. **Variables de Entorno:**
   Agrega todas las variables del `.env`:
   - `DATABASE_URL` (usar Internal Database URL)
   - `JWT_SECRET`
   - `CLOUDINARY_*`
   - `MERCADOPAGO_ACCESS_TOKEN` (usar token de producción)
   - `EMAIL_*`
   - `FRONTEND_URL` (URL de Vercel)
   - `NODE_ENV=production`

4. **Deploy:**
   - El deploy se ejecuta automáticamente
   - Las migraciones se aplican en cada deploy

### Railway / Heroku

Similar a Render, ajustar comandos según la plataforma.

---

## 🔒 Seguridad

### Mejores prácticas implementadas:

- ✅ JWT para autenticación
- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ Validación de datos con class-validator
- ✅ CORS configurado
- ✅ Variables de entorno para secretos
- ✅ Sanitización de inputs
- ✅ Guards para proteger rutas sensibles

### Para producción:

- ⚠️ Cambiar `JWT_SECRET` por uno seguro y único
- ⚠️ Usar HTTPS en todas las comunicaciones
- ⚠️ Implementar rate limiting
- ⚠️ Agregar helmet para headers de seguridad
- ⚠️ Revisar logs de Cloudinary y Mercado Pago
- ⚠️ Configurar webhooks de Mercado Pago

---

## 📊 Monitoreo y Logs

### Logs en Desarrollo

```bash
# Ver logs en tiempo real
npm run start:dev
```

### Logs en Producción (Render)

- Dashboard → Logs → Ver logs en tiempo real
- Filtrar por errores, warnings, etc.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
- Verifica que PostgreSQL esté corriendo
- Revisa `DATABASE_URL` en `.env`
- Verifica credenciales de la base de datos

### Error: "Cloudinary upload failed"

**Solución:**
- Verifica credenciales de Cloudinary en `.env`
- Revisa límites de tu cuenta (free tier)
- Verifica que las imágenes no excedan el tamaño máximo

### Error: "JWT token expired"

**Solución:**
- El token expira según `JWT_EXPIRATION` (default: 7 días)
- El usuario debe volver a hacer login
- Ajusta `JWT_EXPIRATION` si es necesario

### Error: "Mercado Pago payment rejected"

**Soluciones:**
- Verifica que uses tarjetas de prueba en desarrollo
- Usa nombre "APRO" para aprobar
- Revisa que el Access Token sea el correcto (test/prod)
- Verifica logs de Mercado Pago en su dashboard

---

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Mercado Pago Docs](https://www.mercadopago.com.ar/developers/es/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Nodemailer Docs](https://nodemailer.com/about/)

---

## 🤝 Contribuir

Ver [README principal](../README.md) para guías de contribución.

---

## 📝 Notas de Versión

### v1.0.0
- ✅ CRUD completo de productos, categorías y pedidos
- ✅ Autenticación JWT
- ✅ Integración con Mercado Pago
- ✅ Envío de emails con facturas
- ✅ Subida de imágenes a Cloudinary
- ✅ Seed automático con datos de prueba