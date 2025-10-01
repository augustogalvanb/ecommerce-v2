import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.generateSlug(createCategoryDto.name);

    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: createCategoryDto.name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (updateCategoryDto.name) {
      const slug = this.generateSlug(updateCategoryDto.name);

      const existingCategory = await this.prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                { name: updateCategoryDto.name },
                { slug },
              ],
            },
          ],
        },
      });

      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      return this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          slug,
        },
      });
    }

    return category;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (category._count.products > 0) {
      throw new ConflictException(
        'No se puede eliminar una categoría que tiene productos asociados',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Categoría eliminada exitosamente' };
  }
}