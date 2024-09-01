import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  parentId?: number;
}

export class CategoryDto {
  id: number;
  title: string;
  description: string;
  parentId: number;
  children: CategoryDto[];
}
