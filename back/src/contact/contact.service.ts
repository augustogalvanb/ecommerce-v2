import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;
  private adminEmail: string;

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

    // Email del admin donde llegarán los mensajes
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL')!;
  }

  async sendContactEmail(contactDto: ContactDto) {
    try {
      // Email al admin
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: this.adminEmail,
        replyTo: contactDto.email,
        subject: `Nuevo mensaje de contacto: ${contactDto.subject}`,
        html: this.getAdminEmailTemplate(contactDto),
      });

      // Email de confirmación al usuario
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: contactDto.email,
        subject: 'Hemos recibido tu mensaje - TechStore',
        html: this.getUserConfirmationTemplate(contactDto),
      });

      return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
      console.error('Error enviando email de contacto:', error);
      throw new Error('Error al enviar el mensaje');
    }
  }

  private getAdminEmailTemplate(contact: ContactDto): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #0284c7; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 18px;">Información del remitente</h2>
                    
                    <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px;">
                      <tr>
                        <td style="color: #666666; font-weight: bold; width: 120px;">Nombre:</td>
                        <td style="color: #333333;">${contact.name}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-weight: bold;">Email:</td>
                        <td style="color: #0284c7;"><a href="mailto:${contact.email}" style="color: #0284c7; text-decoration: none;">${contact.email}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-weight: bold;">Asunto:</td>
                        <td style="color: #333333;">${contact.subject}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-weight: bold;">Fecha:</td>
                        <td style="color: #333333;">${new Date().toLocaleString('es-AR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</td>
                      </tr>
                    </table>

                    <h3 style="margin: 30px 0 15px 0; color: #333333; font-size: 16px;">Mensaje:</h3>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #0284c7;">
                      <p style="margin: 0; color: #333333; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
                    </div>

                    <div style="margin-top: 30px; padding: 15px; background-color: #fff7ed; border-left: 4px solid #f59e0b; border-radius: 4px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px;">
                        <strong>Nota:</strong> Puedes responder directamente a este email para contactar al cliente.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #666666; font-size: 14px;">TechStore - Panel de Administración</p>
                    <p style="margin: 5px 0 0 0; color: #999999; font-size: 12px;">Este email fue enviado automáticamente desde el formulario de contacto</p>
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

  private getUserConfirmationTemplate(contact: ContactDto): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #0284c7; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">¡Gracias por contactarnos!</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">Hola ${contact.name},</h2>
                    <p style="margin: 0 0 20px 0; color: #666666; line-height: 1.6;">
                      Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te responderá a la brevedad.
                    </p>

                    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin: 0 0 10px 0; color: #0284c7; font-size: 16px;">Resumen de tu consulta:</h3>
                      <table width="100%" cellpadding="5" cellspacing="0">
                        <tr>
                          <td style="color: #666666; font-weight: bold; width: 80px;">Asunto:</td>
                          <td style="color: #333333;">${contact.subject}</td>
                        </tr>
                        <tr>
                          <td style="color: #666666; font-weight: bold;">Mensaje:</td>
                          <td style="color: #333333;">${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}</td>
                        </tr>
                      </table>
                    </div>

                    <p style="margin: 20px 0; color: #666666; line-height: 1.6;">
                      Normalmente respondemos en menos de 24 horas hábiles.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="background-color: #0284c7; border-radius: 6px;">
                            <a href="${this.configService.get('FRONTEND_URL')}" 
                               style="display: inline-block; padding: 12px 30px; color: #ffffff; text-decoration: none; font-weight: bold;">
                              Visitar TechStore
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Mientras tanto, puedes seguir explorando nuestros productos o conocer más sobre nosotros.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 5px 0; color: #333333; font-weight: bold;">TechStore</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">Av. Mate de Luna 1000, San Miguel de Tucumán</p>
                    <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">info@techstore.com | +54 381 123-4567</p>
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
}