import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MercadopagoModule } from './mercado pago/mercadopago.module';
import { EmailModule } from './email/email.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    MercadopagoModule,
    EmailModule,
    ContactModule
  ],
})
export class AppModule {}
