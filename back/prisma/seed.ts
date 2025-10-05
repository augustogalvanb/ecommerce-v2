import { PrismaClient, Category } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imagen a Cloudinary desde URL
async function uploadImageToCloudinary(imageUrl: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'ecommerce-products',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ========== 1. CREAR ADMIN ==========
  console.log('👤 Creando administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  });

  console.log('✅ Admin creado:', admin.email);

  // ========== 2. CREAR CATEGORÍAS ==========
  console.log('\n📁 Creando categorías...');
  const categories = [
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Auriculares', slug: 'auriculares' },
    { name: 'Accesorios', slug: 'accesorios' },
  ];

  const createdCategories: Category[] = [];
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(cat);
    console.log(`  ✅ ${cat.name}`);
  }

  // ========== 3. CREAR PRODUCTOS CON IMÁGENES ==========
  console.log('\n📦 Creando productos y subiendo imágenes a Cloudinary...');
  console.log('⏳ Esto puede tardar unos minutos...\n');

  interface ProductSeed {
    name: string;
    description: string;
    price: number;
    stock: number;
    categorySlug: string;
    images: string[];
  }

  const products: ProductSeed[] = [
    {
      name: 'MacBook Pro 14"',
      description: 'Laptop profesional con chip M2 Pro, 16GB RAM, 512GB SSD. Pantalla Retina de 14 pulgadas. Ideal para desarrollo y diseño.',
      price: 2499.99,
      stock: 15,
      categorySlug: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      ],
    },
    {
      name: 'Dell XPS 15',
      description: 'Laptop de alto rendimiento con Intel Core i7, 32GB RAM, 1TB SSD. Pantalla InfinityEdge 4K. Perfecta para profesionales creativos.',
      price: 1899.99,
      stock: 10,
      categorySlug: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      ],
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Smartphone con chip A17 Pro, cámara de 48MP, pantalla Super Retina XDR de 6.1". Diseño en titanio. 256GB de almacenamiento.',
      price: 1299.99,
      stock: 25,
      categorySlug: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1592286927505-c6d5e9d8f894?w=800',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Smartphone premium con S Pen, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.8". Procesador Snapdragon 8 Gen 3. 512GB.',
      price: 1399.99,
      stock: 20,
      categorySlug: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      ],
    },
    {
      name: 'AirPods Pro 2',
      description: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial personalizado. Hasta 6 horas de reproducción con una carga.',
      price: 299.99,
      stock: 50,
      categorySlug: 'auriculares',
      images: [
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      ],
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Auriculares over-ear premium con la mejor cancelación de ruido del mercado. 30 horas de batería. Audio de alta resolución.',
      price: 399.99,
      stock: 30,
      categorySlug: 'auriculares',
      images: [
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      ],
    },
    {
      name: 'Magic Mouse',
      description: 'Mouse inalámbrico con superficie Multi-Touch. Diseño minimalista y ergonómico. Batería recargable de larga duración.',
      price: 89.99,
      stock: 40,
      categorySlug: 'accesorios',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
      ],
    },
    {
      name: 'Teclado Mecánico RGB',
      description: 'Teclado mecánico gaming con switches Cherry MX, iluminación RGB personalizable. Diseño TKL compacto. Ideal para gamers.',
      price: 149.99,
      stock: 35,
      categorySlug: 'accesorios',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
      ],
    },
  ];

  for (const productData of products) {
    try {
      // Encontrar categoría
      const category = createdCategories.find(
        (cat) => cat.slug === productData.categorySlug
      );

      if (!category) {
        console.log(`  ⚠️  Categoría no encontrada para ${productData.name}`);
        continue;
      }

      // Subir imágenes a Cloudinary
      console.log(`  📤 Subiendo imágenes para "${productData.name}"...`);
      const uploadedImages: string[] = [];

      for (const imageUrl of productData.images) {
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);
          uploadedImages.push(cloudinaryUrl);
          console.log(`    ✅ Imagen subida`);
        } catch (error) {
          console.log(`    ⚠️  Error subiendo imagen, usando URL original`);
          uploadedImages.push(imageUrl);
        }
      }

      // Crear producto
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          images: uploadedImages,
          categoryId: category.id,
          isActive: true,
        },
      });

      console.log(`  ✅ Producto creado: ${product.name} ($${product.price})`);
    } catch (error) {
      console.error(`  ❌ Error creando producto ${productData.name}:`, error);
    }
  }

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`  - Admin: ${admin.email}`);
  console.log(`  - Categorías: ${createdCategories.length}`);
  console.log(`  - Productos: ${products.length}`);
  console.log('\n🔐 Credenciales de Admin:');
  console.log(`  Email: ${admin.email}`);
  console.log(`  Password: admin123`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });