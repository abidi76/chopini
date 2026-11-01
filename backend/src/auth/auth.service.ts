import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private publicUser(u: { id: string; email: string; name: string; phone: string | null; city: string | null; role: string }) {
    const { id, email, name, phone, city, role } = u;
    return { id, email, name, phone, city, role };
  }

  private sign(u: { id: string; role: string }) {
    return this.jwt.signAsync({ sub: u.id, role: u.role });
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email.toLowerCase() }, ...(dto.phone ? [{ phone: dto.phone }] : [])] },
    });
    if (exists) throw new ConflictException('Email ou téléphone déjà utilisé');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash: await bcrypt.hash(dto.password, 10),
        name: dto.name,
        phone: dto.phone,
        city: dto.city,
      },
    });
    return { user: this.publicUser(user), accessToken: await this.sign(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !ok) throw new UnauthorizedException('Email ou mot de passe incorrect');
    return { user: this.publicUser(user), accessToken: await this.sign(user) };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.publicUser(user);
  }
}
