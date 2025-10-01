import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: admin.id, email: admin.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  async validateAdmin(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin no encontrado');
    }

    return admin;
  }

  async createAdmin(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}