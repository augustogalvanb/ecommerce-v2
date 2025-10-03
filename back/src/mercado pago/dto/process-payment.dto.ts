import { IsNotEmpty, IsString, IsEmail, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PayerIdentificationDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

class PayerDto {
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => PayerIdentificationDto)
  identification: PayerIdentificationDto;
}

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsNumber()
  installments: number;

  @ValidateNested()
  @Type(() => PayerDto)
  payer: PayerDto;
}