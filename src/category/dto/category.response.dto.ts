import { IsInt, IsOptional, IsString } from '@nestjs/class-validator';
import { Category } from '../entities/category.entity';

export class CategoryResponseDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  parent?: CategoryResponseDto; // Use the same DTO to represent the parent

  @IsOptional()
  children?: CategoryResponseDto[]; // Use the same DTO to represent the children

  constructor(category: Category) {
    this.id = category.id;
    this.title = category.title;
    this.description = category.description;
    this.parent = category.parent
      ? new CategoryResponseDto(category.parent)
      : undefined;
    this.children = category.children
      ? category.children.map((child) => new CategoryResponseDto(child))
      : [];
  }
}
