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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: right; margin-top: 20px; }
          .button { display: inline-block; background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">¡Gracias por tu compra!</h1>
            <p style="margin: 10px 0 0 0;">Tu pedido ha sido confirmado</p>
          </div>
          
          <div class="content">
            <h2>Hola ${order.customerName},</h2>
            <p>Tu pedido ha sido recibido y está siendo procesado. Adjuntamos la factura en formato PDF.</p>
            
            <div class="order-info">
              <h3 style="margin-top: 0;">Información del Pedido</h3>
              <div class="info-row">
                <strong>Número de Pedido:</strong>
                <span>${order.orderNumber}</span>
              </div>
              <div class="info-row">
                <strong>Fecha:</strong>
                <span>${new Date(order.createdAt).toLocaleDateString('es-AR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div class="info-row">
                <strong>Estado:</strong>
                <span style="color: #0284c7; font-weight: bold;">${this.getStatusLabel(order.status)}</span>
              </div>
              <div class="info-row">
                <strong>Estado de Pago:</strong>
                <span style="color: ${order.paymentStatus === 'APPROVED' ? '#10b981' : '#f59e0b'}; font-weight: bold;">
                  ${this.getPaymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>

            <h3>Productos</h3>
            <table>
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 10px; text-align: left;">Producto</th>
                  <th style="padding: 10px; text-align: center;">Cantidad</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                  <th style="padding: 10px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total">
              <h2 style="margin: 0;">Total: $${Number(order.totalAmount).toFixed(2)}</h2>
            </div>

            <div style="text-align: center;">
              <a href="${this.configService.get('FRONTEND_URL')}/track-order" class="button">
                Rastrear mi pedido
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Nota:</strong> Guarda tu número de pedido para futuras consultas.
            </p>
          </div>

          <div class="footer">
            <p>TechStore - Tu tienda de tecnología de confianza</p>
            <p>Av. Mate de Luna 1000, San Miguel de Tucumán, Argentina</p>
            <p>info@techstore.com | +54 381 123-4567</p>
            <p style="margin-top: 20px; font-size: 11px;">
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </div>
        </div>
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