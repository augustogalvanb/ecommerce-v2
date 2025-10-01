import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async create(createOrderDto: CreateOrderDto) {
    // Validar que todos los productos existan y tengan stock suficiente
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'Uno o más productos no están disponibles',
      );
    }

    // Crear un mapa de productos para acceso rápido
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validar stock y calcular totales
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of createOrderDto.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Producto ${item.productId} no encontrado`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto "${product.name}". Stock disponible: ${product.stock}`,
        );
      }

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Crear la orden y actualizar el stock en una transacción
    const order = await this.prisma.$transaction(async (prisma) => {
      // Crear la orden
      const newOrder = await prisma.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          customerName: createOrderDto.customerName,
          customerEmail: createOrderDto.customerEmail,
          customerPhone: createOrderDto.customerPhone,
          totalAmount,
          status: 'PENDING',
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      // Actualizar el stock de cada producto
      for (const item of createOrderDto.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll(status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    // Si el pedido está pendiente, devolver el stock
    if (order.status === 'PENDING') {
      await this.prisma.$transaction(async (prisma) => {
        // Devolver el stock
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        // Eliminar la orden
        await prisma.order.delete({
          where: { id },
        });
      });
    } else {
      // Si no está pendiente, solo eliminar
      await this.prisma.order.delete({
        where: { id },
      });
    }

    return { message: 'Pedido eliminado exitosamente' };
  }
}