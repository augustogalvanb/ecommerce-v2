import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsUUID('4', { message: 'El ID del producto debe ser válido' })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  productId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  customerName: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  customerEmail: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  customerPhone: string;

  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un item en el pedido' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}