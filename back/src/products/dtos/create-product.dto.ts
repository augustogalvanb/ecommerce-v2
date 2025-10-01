import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(200, { message: 'El nombre no puede tener más de 200 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsUUID('4', { message: 'El ID de categoría debe ser válido' })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryId: string;
}