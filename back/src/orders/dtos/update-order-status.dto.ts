import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'El estado del pedido no es válido' })
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: OrderStatus;
}