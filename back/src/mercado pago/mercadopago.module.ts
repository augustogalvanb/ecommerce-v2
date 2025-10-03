import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module'; // NUEVO

@Module({
  imports: [ConfigModule, PrismaModule, EmailModule], // Agregar EmailModule
  controllers: [MercadopagoController],
  providers: [MercadopagoService],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}