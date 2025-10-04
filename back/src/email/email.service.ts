import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { Order } from '@prisma/client';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendOrderConfirmation(order: any) {
    try {
      // Generar PDF
      const pdfBuffer = await this.generateInvoicePDF(order);

      // Enviar email
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: order.customerEmail,
        subject: `Confirmación de pedido #${order.orderNumber} - TechStore`,
        html: this.getEmailTemplate(order),
        attachments: [
          {
            filename: `Factura-${order.orderNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      console.log(`Email enviado a ${order.customerEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }

  private async generateInvoicePDF(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .fillColor('#0284c7')
        .text('TechStore', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(16)
        .fillColor('#000')
        .text('FACTURA', { align: 'center' })
        .moveDown(1);

      // Order Info
      doc.fontSize(10).fillColor('#666');
      
      doc.text(`Número de Pedido: ${order.orderNumber}`, 50, 150);
      doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-AR')}`, 50, 165);
      doc.text(`Estado: ${order.status}`, 50, 180);
      
      doc.moveDown(2);

      // Customer Info
      doc.fontSize(12).fillColor('#000').text('Datos del Cliente:', 50, 210);
      doc.fontSize(10).fillColor('#666');
      doc.text(`Nombre: ${order.customerName}`, 50, 230);
      doc.text(`Email: ${order.customerEmail}`, 50, 245);
      doc.text(`Teléfono: ${order.customerPhone}`, 50, 260);

      doc.moveDown(2);

      // Table Header
      const tableTop = 300;
      doc.fontSize(10).fillColor('#000');
      
      doc.text('Producto', 50, tableTop, { width: 200 });
      doc.text('Cantidad', 270, tableTop, { width: 80, align: 'center' });
      doc.text('Precio Unit.', 350, tableTop, { width: 90, align: 'right' });
      doc.text('Subtotal', 450, tableTop, { width: 90, align: 'right' });

      // Line
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, tableTop + 15)
        .lineTo(540, tableTop + 15)
        .stroke();

      // Items
      let yPosition = tableTop + 25;
      doc.fontSize(9).fillColor('#333');

      order.orderItems.forEach((item: any) => {
        doc.text(item.productName, 50, yPosition, { width: 200 });
        doc.text(item.quantity.toString(), 270, yPosition, { width: 80, align: 'center' });
        doc.text(`$${Number(item.productPrice).toFixed(2)}`, 350, yPosition, { width: 90, align: 'right' });
        doc.text(`$${Number(item.subtotal).toFixed(2)}`, 450, yPosition, { width: 90, align: 'right' });
        
        yPosition += 25;
      });

      // Total Line
      yPosition += 10;
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, yPosition)
        .lineTo(540, yPosition)
        .stroke();

      // Total
      yPosition += 15;
      doc.fontSize(12).fillColor('#000');
      doc.text('TOTAL:', 350, yPosition, { width: 90, align: 'right' });
      doc.fontSize(14).fillColor('#0284c7');
      doc.text(`$${Number(order.totalAmount).toFixed(2)}`, 450, yPosition, { width: 90, align: 'right' });

      // Footer
      doc
        .fontSize(8)
        .fillColor('#999')
        .text(
          'Gracias por tu compra | TechStore | info@techstore.com | +54 381 123-4567',
          50,
          doc.page.height - 50,
          { align: 'center', width: 500 }
        );

      doc.end();
    });
  }

  private getEmailTemplate(order: any): string {
  const itemsHtml = order.orderItems
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.productPrice).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${Number(item.subtotal).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!--[if mso]>
      <style type="text/css">
        table {border-collapse: collapse;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Header con fondo azul -->
              <tr>
                <td style="background-color: #0284c7; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">¡Gracias por tu compra!</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Tu pedido ha sido confirmado</p>
                </td>
              </tr>
              
              <!-- Contenido -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin: 0 0 10px 0; color: #333333; font-size: 20px;">Hola ${order.customerName},</h2>
                  <p style="margin: 0 0 20px 0; color: #666666; line-height: 1.6;">
                    Tu pedido ha sido recibido y está siendo procesado. Adjuntamos la factura en formato PDF.
                  </p>
                  
                  <!-- Información del pedido -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">Información del Pedido</h3>
                        
                        <table width="100%" cellpadding="5" cellspacing="0">
                          <tr>
                            <td style="color: #666666; font-weight: bold;">Número de Pedido:</td>
                            <td style="text-align: right; color: #333333; font-family: monospace;">${order.orderNumber}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-weight: bold;">Fecha:</td>
                            <td style="text-align: right; color: #333333;">${new Date(order.createdAt).toLocaleDateString('es-AR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-weight: bold;">Estado:</td>
                            <td style="text-align: right; color: #0284c7; font-weight: bold;">${this.getStatusLabel(order.status)}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-weight: bold;">Estado de Pago:</td>
                            <td style="text-align: right; color: ${order.paymentStatus === 'APPROVED' ? '#10b981' : '#f59e0b'}; font-weight: bold;">
                              ${this.getPaymentStatusLabel(order.paymentStatus)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <h3 style="margin: 30px 0 15px 0; color: #333333; font-size: 18px;">Productos</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #f8fafc;">
                        <th style="padding: 10px; text-align: left; color: #666666; font-size: 14px;">Producto</th>
                        <th style="padding: 10px; text-align: center; color: #666666; font-size: 14px;">Cantidad</th>
                        <th style="padding: 10px; text-align: right; color: #666666; font-size: 14px;">Precio</th>
                        <th style="padding: 10px; text-align: right; color: #666666; font-size: 14px;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Total -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-radius: 8px; margin-top: 20px;">
                    <tr>
                      <td style="padding: 15px; text-align: right;">
                        <h2 style="margin: 0; color: #333333; font-size: 24px;">Total: $${Number(order.totalAmount).toFixed(2)}</h2>
                      </td>
                    </tr>
                  </table>

                  <!-- Botón -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color: #0284c7; border-radius: 6px;">
                              <a href="${this.configService.get('FRONTEND_URL')}/track-order" 
                                 style="display: inline-block; padding: 12px 30px; color: #ffffff; text-decoration: none; font-weight: bold;">
                                Rastrear mi pedido
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 30px 0 0 0; padding: 15px; background-color: #fff7ed; border-left: 4px solid #f59e0b; color: #92400e; font-size: 14px; line-height: 1.6;">
                    <strong>Nota:</strong> Guarda tu número de pedido para futuras consultas.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #333333; font-weight: bold;">TechStore</p>
                  <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">Tu tienda de tecnología de confianza</p>
                  <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">Av. Mate de Luna 1000, San Miguel de Tucumán, Argentina</p>
                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px;">info@techstore.com | +54 381 123-4567</p>
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    Si tienes alguna pregunta, no dudes en contactarnos.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

  private getStatusLabel(status: string): string {
    const labels = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
    };
    return labels[status] || status;
  }

  private getPaymentStatusLabel(status: string): string {
    const labels = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
      IN_PROCESS: 'En proceso',
      CANCELLED: 'Cancelado',
      REFUNDED: 'Reembolsado',
    };
    return labels[status] || status;
  }
}