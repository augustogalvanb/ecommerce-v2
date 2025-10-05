import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class MercadopagoService {
  private client: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado');
    }
    
    this.client = new MercadoPagoConfig({
      accessToken: accessToken,
    });
  }

  async processPayment(paymentData: {
    orderId: string;
    token: string;
    paymentMethodId: string;
    installments: number;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
  }) {
    try {
      // Obtener orden
      const order = await this.prisma.order.findUnique({
        where: { id: paymentData.orderId },
        include: {
          orderItems: true,
        },
      });

      if (!order) {
        throw new BadRequestException('Orden no encontrada');
      }

      // Crear pago en Mercado Pago
      const payment = new Payment(this.client);

      const paymentResponse = await payment.create({
        body: {
          transaction_amount: Number(order.totalAmount),
          token: paymentData.token,
          description: `Pedido #${order.orderNumber}`,
          installments: paymentData.installments,
          payment_method_id: paymentData.paymentMethodId,
          payer: {
            email: paymentData.payer.email,
            identification: {
              type: paymentData.payer.identification.type,
              number: paymentData.payer.identification.number,
            },
          },
        },
      });

      // Extraer valores con validación
      const paymentId = paymentResponse.id ? paymentResponse.id.toString() : null;
      const paymentStatus = paymentResponse.status || 'pending';

      // Actualizar orden con información del pago
      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: paymentId,
          paymentMethod: paymentData.paymentMethodId,
          paymentStatus: this.mapPaymentStatus(paymentStatus), // Ahora retorna PaymentStatus enum
          status: paymentStatus === 'approved' ? 'CONFIRMED' : 'PENDING',
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Enviar email si el pago fue aprobado
      if (paymentStatus === 'approved') {
        try {
          await this.emailService.sendOrderConfirmation(updatedOrder);
        } catch (emailError) {
          console.error('Error enviando email, pero el pago fue exitoso:', emailError);
        }
      }

      return {
        success: paymentStatus === 'approved',
        status: paymentStatus,
        statusDetail: paymentResponse.status_detail,
        paymentId: paymentId,
        order: updatedOrder,
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new BadRequestException(
        'Error al procesar el pago: ' + (error.message || 'Error desconocido'),
      );
    }
  }

  // CAMBIAR EL TIPO DE RETORNO A PaymentStatus
  private mapPaymentStatus(mpStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      approved: PaymentStatus.APPROVED,
      rejected: PaymentStatus.REJECTED,
      in_process: PaymentStatus.IN_PROCESS,
      pending: PaymentStatus.PENDING,
      cancelled: PaymentStatus.CANCELLED,
      refunded: PaymentStatus.REFUNDED,
    };
    return statusMap[mpStatus] || PaymentStatus.PENDING;
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: paymentId });
      
      return {
        status: paymentData.status,
        statusDetail: paymentData.status_detail,
        paymentMethod: paymentData.payment_method_id,
        transactionAmount: paymentData.transaction_amount,
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener estado del pago');
    }
  }
}