import { Condition } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString() @MinLength(3) title: string;
  @IsString() @MinLength(10) description: string;
  @IsNumber() @IsPositive() price: number;
  @IsEnum(Condition) condition: Condition;
  @IsString() categoryId: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() size?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsObject() attributes?: Record<string, any>;
  @IsOptional() @IsArray() @IsString({ each: true }) imageUrls?: string[];
}
