import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Controller('payments')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('process')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.mercadopagoService.processPayment(processPaymentDto);
  }

  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.mercadopagoService.getPaymentStatus(paymentId);
  }
}