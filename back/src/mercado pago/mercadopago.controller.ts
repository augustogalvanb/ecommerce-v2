import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Controller('payments')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  // IMPORTANTE: NO agregar UseGuards aquí - debe ser público
  @Post('process')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.mercadopagoService.processPayment(processPaymentDto);
  }

  // También público para consultas
  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.mercadopagoService.getPaymentStatus(paymentId);
  }
}