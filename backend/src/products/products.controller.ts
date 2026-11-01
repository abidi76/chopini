import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService, CreateProductDto } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('q') q?: string,
  ) {
    return this.products.findAll({ category, condition, minPrice, maxPrice, q });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  // TODO: protéger avec un guard JWT et prendre sellerId depuis l'utilisateur connecté
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }
}
