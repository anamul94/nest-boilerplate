import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ required: false })
  parentId?: number;

  //   @ApiProperty({ required: false })
  createdBy: string;
  //   @ApiProperty({ required: false })
  updatedBy: string;
}

export class CategoryDto {
  id: number;
  title: string;
  description: string;
  parentId: number;
  children: CategoryDto[];
}
