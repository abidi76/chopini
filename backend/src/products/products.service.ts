import { Injectable, NotFoundException } from '@nestjs/common';
import { Condition, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(f: { category?: string; condition?: string; minPrice?: string; maxPrice?: string; q?: string }) {
    const where: Prisma.ProductWhereInput = { status: 'ACTIVE' };
    if (f.category) where.category = { slug: f.category };
    if (f.condition) where.condition = f.condition as Condition;
    if (f.minPrice || f.maxPrice) {
      where.price = {
        ...(f.minPrice ? { gte: Number(f.minPrice) } : {}),
        ...(f.maxPrice ? { lte: Number(f.maxPrice) } : {}),
      };
    }
    if (f.q) where.title = { contains: f.q, mode: 'insensitive' };

    return this.prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true, seller: { select: { id: true, name: true, city: true, isVerified: true } } },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  create(dto: CreateProductDto, sellerId: string) {
    const { imageUrls = [], attributes, ...data } = dto;
    return this.prisma.product.create({
      data: {
        ...data,
        sellerId,
        attributes: attributes as Prisma.InputJsonValue | undefined,
        images: { create: imageUrls.map((url, position) => ({ url, position })) },
      },
      include: { images: true },
    });
  }
}
