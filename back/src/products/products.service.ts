import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(
  createProductDto: CreateProductDto,
  files?: Express.Multer.File[],
) {
  const category = await this.prisma.category.findUnique({
    where: { id: createProductDto.categoryId },
  });

  if (!category) {
    throw new NotFoundException('Categoría no encontrada');
  }

  const slug = this.generateSlug(createProductDto.name);

  const existingProduct = await this.prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    throw new ConflictException('Ya existe un producto con ese nombre');
  }

  let imageUrls: string[] = [];

  if (files && files.length > 0) {
    imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
  }

  return this.prisma.product.create({
    data: {
      name: createProductDto.name,
      slug,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      images: imageUrls,
      categoryId: createProductDto.categoryId,
      isActive: true, // Por defecto siempre true al crear
    },
    include: {
      category: true,
    },
  });
}

  async findAll(categoryId?: string, isActive?: boolean) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(
  id: string,
  updateProductDto: UpdateProductDto,
  files?: Express.Multer.File[],
) {
  const product = await this.prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundException('Producto no encontrado');
  }

  if (updateProductDto.categoryId) {
    const category = await this.prisma.category.findUnique({
      where: { id: updateProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
  }

  let slug = product.slug;

  if (updateProductDto.name && updateProductDto.name !== product.name) {
    slug = this.generateSlug(updateProductDto.name);

    const existingProduct = await this.prisma.product.findFirst({
      where: {
        AND: [{ slug }, { id: { not: id } }],
      },
    });

    if (existingProduct) {
      throw new ConflictException('Ya existe un producto con ese nombre');
    }
  }

  let imageUrls = product.images;

  if (files && files.length > 0) {
    const newImageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    imageUrls = [...imageUrls, ...newImageUrls];
  }

  // Preparar datos para actualizar
  const dataToUpdate: any = {
    slug,
    images: imageUrls,
  };

  // Solo agregar campos que vienen en el DTO
  if (updateProductDto.name) dataToUpdate.name = updateProductDto.name;
  if (updateProductDto.description) dataToUpdate.description = updateProductDto.description;
  if (updateProductDto.price !== undefined) dataToUpdate.price = updateProductDto.price;
  if (updateProductDto.stock !== undefined) dataToUpdate.stock = updateProductDto.stock;
  if (updateProductDto.categoryId) dataToUpdate.categoryId = updateProductDto.categoryId;
  if (updateProductDto.isActive !== undefined) dataToUpdate.isActive = updateProductDto.isActive;

  return this.prisma.product.update({
    where: { id },
    data: dataToUpdate,
    include: {
      category: true,
    },
  });
}

  async removeImage(id: string, imageUrl: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!product.images.includes(imageUrl)) {
      throw new BadRequestException('La imagen no pertenece a este producto');
    }

    if (product.images.length === 1) {
      throw new BadRequestException('El producto debe tener al menos una imagen');
    }

    await this.cloudinaryService.deleteImage(imageUrl);

    const updatedImages = product.images.filter((img) => img !== imageUrl);

    return this.prisma.product.update({
      where: { id },
      data: {
        images: updatedImages,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (product.images.length > 0) {
      await this.cloudinaryService.deleteMultipleImages(product.images);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Producto eliminado exitosamente' };
  }
}