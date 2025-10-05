import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'El asunto debe ser un texto' })
  @IsNotEmpty({ message: 'El asunto es requerido' })
  @MaxLength(200, { message: 'El asunto no puede tener más de 200 caracteres' })
  subject: string;

  @IsString({ message: 'El mensaje debe ser un texto' })
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  @MaxLength(1000, { message: 'El mensaje no puede tener más de 1000 caracteres' })
  message: string;
}